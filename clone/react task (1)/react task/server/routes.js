const util = require('util');
const fs = require('fs');
const bcrypt = require('bcrypt'); // expensive operation (critical info only)
const saltRounds = 10;
const ObjectID = require('mongodb').ObjectID;

const DAL = {
    init: async function(db) {
        this.db = db
        this.cache = {
            admin: null,
            users: {},
            settings: {},
            todo: {},
        }
        await this.db.collection('users').createIndex({email:1}, {unique: true})
    },
    makeToken: async function(user) {
        return await bcrypt.hash(user.email + user.hash + (new Date()).getTime(), saltRounds)
    },
    validateEmail: function(email) {
        var re = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
        let out = re.test(String(email).toLowerCase());
        return out
    },
    login: async function(email, password) {
        email = String(email).toLowerCase()
        if (!email || email.length < 3 || !(this.validateEmail(email)))
            throw {error: 'invalid email'}
        if (!password || password.length < 5)
            throw {error: 'invalid password'}

        const user = await this.findUser(email);
        if (!user) throw {error:'email not found'};

        const match = await bcrypt.compare(password+user.salt, user.password);
        if (match) {
            const token = await this.makeToken(user)
            if (!token) throw 'token err';
            await this.db.collection('users').updateOne({_id:user._id}, {'$set':{token:token}})
            return {success:1, token: token}
        }
        else throw {error:'incorrect password'}
    },
    register: async function(username, email, password, pwdConfirm) {
        email = String(email).toLowerCase()
        if (username.length == 0)
            throw {error: 'username missing!'}
        if (!email || email.length < 3 || !(this.validateEmail(email)))
            throw {error: 'invalid email'}
        if (!password || password.length < 5)
            throw {error: 'password too short'}
        if (password !== pwdConfirm)
            throw {error: 'passwords do not match'}


        let user = await this.findUser(email)
        if (user) throw {error: 'email already exists'}
        const salt = await bcrypt.hash( (new Date()).getTime() + email, saltRounds);
        const hash = await bcrypt.hash(password + salt, saltRounds)
        const token = await this.makeToken({email, hash})
        if (!token) throw 'token err';
        await this.db.collection('users').insertOne({
            username : username,
            email: email,
            password: hash,
            salt: salt,
            token: token,
            ts: new Date(),
        })
        return {success: 1, token};
    },
    recover: async function(email) {
        email = String(email).toLowerCase()
        if (!email || email.length < 3 || !(this.validateEmail(email)))
            throw {error: 'invalid email'}

        let user = await this.findUser(email)
        if (!user) throw {error: 'no account with that email'}

        let password = 'r@ndom_passw0rd';
        const salt = await bcrypt.hash( (new Date()).getTime() + email, saltRounds);
        const hash = await bcrypt.hash(password + salt, saltRounds)

        await this.db.collection('users').updateOne({
            email: email
        }, {
            $set: {
                password: hash,
                salt: salt,
            }
        })
        return {success:1};
    },
    auth: async function(token) {
        if (this.cache.users[token])
            return this.cache.users[token];

        const user = await this.db.collection('users').findOne({
            token: token
        });
        if (user)
            this.cache.users[token] = user;
        return user;
    },

    findUser: async function(email) {
        return await this.db.collection('users').findOne({
            email: email
        });
    },
    findUserById: async function(id) {
        return await this.db.collection('users').findOne({
            _id: new ObjectID(id)
        });
    },
    getUsers: async function(page) {
        const pagesize = 20;
        return await this.db.collection('users').find()
                        .sort({ _id: 1 })
                        .skip( page > 0 ? pagesize*(page-1) : 0 )
                        .limit(pagesize)
                        .map(e => { return { name:e.username, email:e.email, date:e.ts }})
                        .toArray();
    },
    get_settings: async function(email) {
        if (!this.cache.settings[email])
            this.cache.settings[email] = await this.db.collection('settings').findOne({
                email: email
            });
        return this.cache.settings[email]
    },
    save_settings: async function(email, form) {
        await this.db.collection('settings').updateOne({
            email: email
        }, {$set: {form, email}}, {upsert: true}) //if object doesn't exist, create it
        this.cache.settings[email] = null;
        return {success:1};
    },
    get_todo: async function(email, date) { //find a todo list of a user for a selected date
        if (!this.cache.todo[email])
            this.cache.todo[email] = {}
        if (!this.cache.todo[email][date]) {
            this.cache.todo[email][date] = await this.db.collection('todoform').findOne({
                email: email,
                date: date
            });
        }
        return this.cache.todo[email][date]
    },
    update_todo: async function(email, form, date) { //update the entire form when a change occured
        await this.db.collection('todoform').updateOne({
            email: email,
            date: date
        }, {$set: {form, date, email}}, {upsert: true})
        this.cache.todo[email][date] = null;
        return {success:1};
    },

    updateAdminSettings: async function(data) {
        await this.db.collection('admin').updateOne({},
            {$set: {
                    quotes: data.quotes, 
                    verses: data.verses, 
                    backgrounds: data.backgrounds, 
                    questions:data.questions,
            }},
            {upsert: true})
        this.cache.admin = null;
        return {success:1};
    },
    getAdminSettings: async function() {
        if (!this.cache.admin)
            this.cache.admin = await this.db.collection('admin').findOne({});
        return this.cache.admin;
    },
}

function initRoutes(socket) {
    socket.on('user/auth', async (data) => {
        try {
            if (! await DAL.auth(data.token)) {
                return socket.emit('user/auth', {error: 'auth failure'})
            }
            
            socket.emit('user/auth', {success: 1});
            
        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('user/auth', err)
            console.error(err)
            return socket.emit('user/auth', {error: 'Action error'});
        }
    });

    socket.on('user/register', async (data) => {
        try {
            if (await DAL.auth(data.token)) {
                return socket.emit('user/register', {error: 'already logged in'})
            }
            const out = await DAL.register(data.username, data.email, data.password, data.password2);

            if ('error' in out)
                return socket.emit('user/register', {error: out.error})
            else if ('success' in out) {
                return socket.emit('user/register', {success: 1, token: out.token});
            }
            
        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('user/register', {error:err.error})
            console.error(err)
            return socket.emit('user/register', {error: 'registration error'})
        }
    });

    socket.on('user/login', async (data) => {
       try {
            if (await DAL.auth(data.token))
                return socket.emit('user/login', {error: 'already logged in'})

            const out = await DAL.login(data.email, data.password)
            if ('error' in out)
                return socket.emit('user/login', {error: out.error})
            else if ('success' in out) {
                return socket.emit('user/login', {success: 1, token: out.token});
            }
        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('user/login', {error:err.error})
            console.error(err)
            return socket.emit('user/login', {error: 'login error'})
        } 
    });

    socket.on('user/recover', async (data) => {
        try {
            if (await DAL.auth(data.token)) {
                return socket.emit('user/recover', {error: 'already logged in'})
            }
            const out = await DAL.recover(data.email)
            if ('error' in out)
                return socket.emit('user/recover', {error: out.error})
            else if ('success' in out) {
               //I want to add here a logic to send a recovery email to the client email address --> function sendEmail
                return socket.emit('user/recover', {success: 1});
            }
            
        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('user/recover', {error:err.error})
            console.error(err)
            return socket.emit('user/recover', {error: 'Invalid email. Please enter a valid email address.'})
        }
    });

    socket.on('settings/update', async (data) => {  
        try {
            const user = await DAL.auth(data.token);
            if (! user) //if user not auth
                return socket.emit('settings/update', {error: 'auth failure'})
            
            await DAL.save_settings(user.email, data.form)
            socket.emit('settings/update', {success: 1})

        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('settings/update', err)
            console.error(err)
            return socket.emit('settings/update', {error: 'Action error'});
        }
    });

    socket.on('settings/get', async (data) => { //get from database to client
        try {
            const user = await DAL.auth(data.token);
            if (! user)
                return socket.emit('settings/get', {error: 'auth failure'})
            
            let ret = await DAL.get_settings(user.email);
            socket.emit('settings/get', {success: 1, form: ret?ret.form:null, username: user.username})

        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('settings/get', err)
            console.error(err)
            return socket.emit('settings/get', {error: 'Action error'});
        }
    });

    socket.on('todo/get', async (data) => {  
        try {
            const user = await DAL.auth(data.token);
            if (! user)
                return socket.emit('todo/get', {error: 'auth failure'})
            
            const {questions} = await DAL.getAdminSettings();
            let question = questions[parseInt(data.date.split('/')[0]) % questions.length];

            let todo = await DAL.get_todo(user.email, data.date);
            socket.emit('todo/get', {success: 1, form: todo?todo.form:null, question:todo?null:question})

        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('todo/get', err)
            console.error(err)
            return socket.emit('todo/get', {error: 'Action error'});
        }
    });


    socket.on('admin/users/get', async (data) => {  
        try {
            if (!data.token || data.token !== 'SUPERLUCKY47')
                throw {error: 'screw you hacker!'}
            
            let users = await DAL.getUsers(data.page);
            socket.emit('admin/users/get', {success: 1, users})

        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('admin/users/get', err)
            console.error(err)
            return socket.emit('admin/users/get', {error: 'Action error'});
        }
    });
    socket.on('admin/settings/get', async (data) => {  
        try {
            if (!data.token || data.token !== 'SUPERLUCKY47')
                throw {error: 'screw you hacker!'}
            
            let settings = await DAL.getAdminSettings();
            socket.emit('admin/settings/get', {success: 1, settings})

        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('admin/settings/get', err)
            console.error(err)
            return socket.emit('admin/settings/get', {error: 'Action error'});
        }
    });
    socket.on('admin/settings/update', async (data) => {  
        try {
            if (!data.token || data.token !== 'SUPERLUCKY47')
                throw {error: 'screw you hacker!'}
            
            await DAL.updateAdminSettings(data.data);
            socket.emit('admin/settings/update', {success: 1})

        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('admin/settings/update', err)
            console.error(err)
            return socket.emit('admin/settings/update', {error: 'Action error'});
        }
    });
    
    socket.on('todo/update', async (data) => {  
        try {
            const user = await DAL.auth(data.token);
            if (! user)
                return socket.emit('todo/update', {error: 'auth failure'})
            
            await DAL.update_todo(user.email, data.form, data.date) 
            socket.emit('todo/update', {success: 1})

        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('todo/update', err)
            console.error(err)
            return socket.emit('todo/update', {error: 'Action error'});
        }
    });

    socket.on('quotes/get/random', async (data) => {  
        try {
            const {verses, quotes} = await DAL.getAdminSettings();
            let arr;
            if (data.verses && data.quotes) {
                if (getRandomInt(2) === 0)
                    arr = verses;
                else
                    arr = quotes;
            } else if (data.verses) {
                arr = verses;
            } else if (data.quotes) {
                arr = quotes;
            }
            let rand = arr[Math.floor(Math.random()*arr.length)];
            socket.emit('quotes/get/random', {success: 1, text: rand})
        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('quotes/get/random', err)
            console.error(err)
            return socket.emit('quotes/get/random', {error: 'Action error'});
        }
    });

    socket.on('background/get/random', async (data) => {  
        try {
            const {backgrounds} = await DAL.getAdminSettings();
            let rand = backgrounds[Math.floor(Math.random()*backgrounds.length)];
            socket.emit('background/get/random', {success: 1, url: rand})
        } catch (err) {
            if (err && 'error' in err && Object.keys(err).length === 1)
                return socket.emit('background/get/random', err)
            console.error(err)
            return socket.emit('background/get/random', {error: 'Action error'});
        }
    });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max); // max excluded
}

module.exports.initRoutes = initRoutes;
module.exports.DAL = DAL;