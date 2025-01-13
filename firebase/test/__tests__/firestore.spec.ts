/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// https://github.com/firebase/quickstart-testing

import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { describe, test, beforeAll, afterAll } from "@jest/globals";
import { Auth, User } from "firebase/auth";
import { doc, getDoc, setDoc, setLogLevel } from "firebase/firestore";
import { readFileSync, createWriteStream } from "node:fs";
import { get } from "node:http";
import { resolve } from "node:path";

import {
  expectPermissionGetDenied,
  expectPermissionGetSucceeds,
  getAuthCoverageMeta,
  getFirestoreCoverageMeta,
  getUser,
} from "./utils";

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

let testEnv: RulesTestEnvironment;
let authTestEnv: Auth;
let authUser: User;

const PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!;
const FIREBASE_CONFIG_FILES_PATH = (file: string): string =>
  resolve(__dirname, `../../${file}`);

beforeAll(async () => {
  // Silence expected rules rejections from Firestore SDK. Unexpected rejections
  // will still bubble up and will be thrown as an error (failing the tests).
  setLogLevel("error");
  const { host, port } = getFirestoreCoverageMeta(
    PROJECT_ID,
    FIREBASE_CONFIG_FILES_PATH("firebase.json"),
  );

  /* eslint-disable no-console */
  console.info(
    `Starting in ${FIREBASE_CONFIG_FILES_PATH("")} - Project ID: ${PROJECT_ID}, On host: ${host} and port: ${port}`,
  );

  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host,
      port,
      rules: readFileSync(
        FIREBASE_CONFIG_FILES_PATH("firestore.rules"),
        "utf8",
      ),
    },
  });

  authTestEnv = getAuthCoverageMeta(
    FIREBASE_CONFIG_FILES_PATH("firebase.json"),
  );

  authUser = await getUser(authTestEnv, "foobar@test.com", "foobar123");
});

afterAll(async () => {
  // Write the coverage report to a file
  const { coverageUrl } = getFirestoreCoverageMeta(
    PROJECT_ID,
    FIREBASE_CONFIG_FILES_PATH("firebase.json"),
  );
  const coverageFile = "./firestore-coverage.html";
  const fstream = createWriteStream(coverageFile);
  await new Promise((resolve, reject) => {
    get(coverageUrl, (res) => {
      res.pipe(fstream, { end: true });
      res.on("end", resolve);
      res.on("error", reject);
    });
  });

  /* eslint-disable no-console */
  console.info(`View firestore rule coverage information at ${coverageFile}\n`);
});

// beforeEach(async () => {
//   await testEnv.clearFirestore();
// });

// If you want to define global variables for Rules Test Contexts to save some
// typing, make sure to initialize them for *every test* to avoid cache issues.
//
//     let unauthedDb;
//     beforeEach(() => {
//       unauthedDb = testEnv.unauthenticatedContext().database();
//     });
//
// Or you can just create them inline to make tests self-contained like below.

describe("Authenticated user", () => {
  test("should allow authenticated user to read a document that is in the rules", async function () {
    // Create a fake authenticated context
    const authedContext = testEnv
      .authenticatedContext(authUser.uid)
      .firestore();

    // Create a "users/foobar" document in Firestore
    await setDoc(doc(authedContext, "users/foobar"), {
      foo: "bar",
    });

    // Attempt to read the document and expect it to succeed
    await expectPermissionGetSucceeds(
      getDoc(doc(authedContext, "users/foobar")),
    );
  });

  test("shouldn't allow authenticated user to read a document that isn't in the rules", async function () {
    // Create a fake authenticated context
    const authedContext = testEnv
      .authenticatedContext(authUser.uid)
      .firestore();

    // Then test security rules by trying to read it using the client SDK.
    await expectPermissionGetDenied(
      getDoc(doc(authedContext, "unauthorized_doc/foobar")),
    );
  });

  test("should not allow unauthorized user to read a document even if it exists", async function () {
    // Setup: Create documents in DB for testing (bypassing Security Rules).
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "unauthorized_doc/foobar"), {
        foo: "bar",
      });
    });

    const unauthedContext = testEnv.unauthenticatedContext().firestore();

    // Then test security rules by trying to read it using the client SDK.
    await expectPermissionGetDenied(
      getDoc(doc(unauthedContext, "unauthorized_doc/foobar")),
    );
  });
});
