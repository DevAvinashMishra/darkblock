import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import "../App.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const PaginationWrapper = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const classes = useStyles();

  return (
    <nav>
      <div className={classes.root}>
        <Pagination
          count={pageNumbers.length}
          onChange={(event, val) => paginate(val)}
          variant="outlined"
          shape="rounded"
          onClick={window.scrollTo(0, 0)}
        />
      </div>
    </nav>
  );
};

export default PaginationWrapper;
