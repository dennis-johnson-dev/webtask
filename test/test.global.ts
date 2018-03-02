import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as nock from "nock";

chai.use(chaiAsPromised);

before(() => {
  nock.disableNetConnect();
  nock.enableNetConnect("127.0.0.1");
});

afterEach(() => {
  nock.cleanAll();
});
