import React from "react";

const index = () => {
  return (
    <div>
      <div className="w-full py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p>
              Last updated: March 14, 2024
              <br />
              <br />
              This app is created for learning purpose. Also to get know on
              google APIs.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full py-6">
        <div className="container px-4 md:px-6">
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <h2>Information We Collect</h2>
            <h3>Google Account Information</h3>
            <p>
              When you log in to app with google account, we collect your email,
              google image url link and name
            </p>
            <h3>Files and Documents</h3>
            <p>
              This application is created as google drive clone, so it requires
              following permissions from your Google account:
            </p>
            <ul>
              <li>
                <strong>./auth/drive.file</strong> Access and manage only files
                you upload here which are saved in google storage and its not
                accessible publically, only user who created it can generate url
                which will work only for 15 minutes.
              </li>
            </ul>
            <h2>
              We don't collect any user data, This project is build for learning
              purpose
            </h2>
            <p>
              There is no requirement of add any additional personal info to use
              this application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
