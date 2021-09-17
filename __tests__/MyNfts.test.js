import * as React from "react";
import { Router } from "react-router";
import { App } from "../src/App";
import { render, fireEvent, screen } from "@testing-library/react";
import MyNfts from "../src/components/MyNfts";

test("renders myNfts component and check if data is loaded", async () => {
  render(<MyNfts />);

  const nftTitle = await screen.findByTestId("nft-title");

  expect(nftTitle).toHaveText();

  // fill out the form
  // fireEvent.change(screen.getByLabelText(/username/i), {
  //   target: {value: 'chuck'},
  // })
  // fireEvent.change(screen.getByLabelText(/password/i), {
  //   target: {value: 'norris'},
  // })

  // fireEvent.click(screen.getByText(/submit/i))

  // // just like a manual tester, we'll instruct our test to wait for the alert
  // // to show up before continuing with our assertions.
  // const alert = await screen.findByRole('alert')

  // // .toHaveTextContent() comes from jest-dom's assertions
  // // otherwise you could use expect(alert.textContent).toMatch(/congrats/i)
  // // but jest-dom will give you better error messages which is why it's recommended
  // expect(alert).toHaveTextContent(/congrats/i)
  // expect(window.localStorage.getItem('token')).toEqual(fakeUserResponse.token)
});
