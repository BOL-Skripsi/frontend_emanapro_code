import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <div>
        <footer className="main-footer">
          <strong>
            Copyright &copy; 2022-2023{" "}
            <a href="https://onlinelearning.binus.ac.id/">
              Binus Online Learning
            </a>
            .
          </strong>
          All rights reserved.
          <div className="float-right d-none d-sm-inline-block">
            <b>Version</b> 3.0.0
          </div>
        </footer>
      </div>
    );
  }
}
