var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);

// src/data.ts
var INITIAL_ARTISTS = [
  {
    id: "artist_1",
    name: "\uAE40\uD558\uB298 (Kim Ha-neul)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "\uAC15\uC6D0\uB300\uD559\uAD50 \uC11C\uC591\uD654\uACFC 3\uD559\uB144\uC5D0 \uC7AC\uD559 \uC911\uC778 \uD654\uAC00 \uC9C0\uB9DD\uC0DD\uC785\uB2C8\uB2E4. \uACE0\uD5A5 \uCD98\uCC9C\uC758 \uD558\uB298, \uD638\uC218, \uACC4\uC808\uC758 \uBCC0\uD654\uC5D0\uC11C \uC601\uAC10\uC744 \uBC1B\uC544 \uD48D\uACBD\uD654\uB97C \uADF8\uB9BD\uB2C8\uB2E4. \uC544\uC9C1 \uAC1C\uC778\uC804 \uACBD\uD5D8\uC740 \uC5C6\uC9C0\uB9CC A-BEACON\uC744 \uD1B5\uD574 \uCC98\uC74C\uC73C\uB85C \uC791\uD488\uC744 \uC138\uC0C1\uC5D0 \uC120\uBCF4\uC774\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uC5B8\uC820\uAC00 \uB0B4 \uADF8\uB9BC \uD55C \uC7A5\uC774 \uB204\uAD70\uAC00\uC758 \uC77C\uC0C1\uC744 \uC704\uB85C\uD558\uB294 \uB0A0\uC744 \uAFC8\uAFC9\uB2C8\uB2E4.",
    keywords: ["\uB530\uB73B\uD55C", "\uD48D\uACBD", "\uC11C\uC815", "\uC790\uC5F0", "\uD558\uB298", "\uD68C\uD654", "\uC720\uD654"],
    interviewQuestions: [
      {
        question: "\uADF8\uB9BC\uC744 \uC2DC\uC791\uD558\uAC8C \uB41C \uACC4\uAE30\uAC00 \uBB34\uC5C7\uC778\uAC00\uC694?",
        answer: "\uC911\uD559\uAD50 \uBBF8\uC220 \uC2DC\uAC04\uC5D0 \uCC98\uC74C\uC73C\uB85C \uCE94\uBC84\uC2A4\uC5D0 \uBB3C\uAC10\uC744 \uC5B9\uC5C8\uC744 \uB54C \uB290\uAF08\uB358 \uADF8 \uB450\uADFC\uAC70\uB9BC\uC774 \uC544\uC9C1\uB3C4 \uC0DD\uC0DD\uD569\uB2C8\uB2E4. \uACE0\uD5A5 \uCD98\uCC9C\uC758 \uB113\uC740 \uD558\uB298\uC744 \uB2F4\uACE0 \uC2F6\uC5B4\uC11C \uBD93\uC744 \uC7A1\uAC8C \uB410\uC5B4\uC694. \uC9C0\uAE08\uB3C4 \uAC00\uC7A5 \uC88B\uC544\uD558\uB294 \uC18C\uC7AC\uB294 \uAD6C\uB984\uC774\uC5D0\uC694."
      },
      {
        question: "\uD559\uC0DD \uC2E0\uBD84\uC73C\uB85C \uC791\uD488\uC744 \uD310\uB9E4\uD558\uB294 \uAC8C \uC5B4\uC0C9\uD558\uC9C0 \uC54A\uB098\uC694?",
        answer: "\uCC98\uC74C\uC5D4 \uBD80\uB044\uB7FD\uAE30\uB3C4 \uD588\uC5B4\uC694. \uADF8\uB7F0\uB370 \uAD50\uC218\uB2D8\uC774 '\uC791\uD488\uC758 \uAC00\uCE58\uB294 \uACBD\uB825\uC774 \uC544\uB2C8\uB77C \uC9C4\uC2EC\uC5D0\uC11C \uC628\uB2E4'\uACE0 \uD558\uC168\uC5B4\uC694. \uC81C \uADF8\uB9BC\uC774 \uB204\uAD70\uAC00\uC758 \uACF5\uAC04\uC5D0\uC11C \uC791\uC740 \uC704\uB85C\uAC00 \uB41C\uB2E4\uBA74 \uADF8\uAC83\uB9CC\uC73C\uB85C\uB3C4 \uCDA9\uBD84\uD569\uB2C8\uB2E4."
      }
    ],
    email: "sky_h_kim@gmail.com"
  },
  {
    id: "artist_2",
    name: "\uC774\uBBFC\uC6B0 (Lee Min-woo)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "\uD64D\uC775\uB300\uD559\uAD50 \uC870\uC18C\uACFC \uC11D\uC0AC\uACFC\uC815 1\uB144\uCC28\uC785\uB2C8\uB2E4. \uC0B0\uC5C5 \uD3D0\uC790\uC7AC\uC640 \uAE08\uC18D \uC6A9\uC811\uC744 \uD1B5\uD574 \uC720\uAE30\uCCB4\uC758 \uD615\uD0DC\uB97C \uC2E4\uD5D8\uC801\uC73C\uB85C \uD0D0\uAD6C\uD569\uB2C8\uB2E4. \uC11D\uC0AC \uB17C\uBB38 \uC8FC\uC81C\uC778 '\uB3C4\uC2DC \uBB3C\uC131\uC758 \uC0DD\uD0DC\uC801 \uC7AC\uD574\uC11D'\uC744 \uBC14\uD0D5\uC73C\uB85C \uCCAB \uAC1C\uC778\uC804\uC744 \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4. \uBC84\uB824\uC9C4 \uACE0\uCCA0 \uC18D\uC5D0\uC11C \uC0B4\uC544\uC788\uB294 \uC0DD\uBA85\uCCB4\uC758 \uD615\uC0C1\uC744 \uCC3E\uC544\uB0C5\uB2C8\uB2E4.",
    keywords: ["\uAE08\uC18D", "\uC6A9\uC811", "\uC720\uAE30\uCCB4", "\uC0DD\uD0DC", "\uC2E4\uD5D8\uC801", "\uC870\uC18C", "\uC124\uCE58"],
    interviewQuestions: [
      {
        question: "\uC4F0\uB2E4 \uBC84\uB9B0 \uCCA0\uC7AC\uB97C \uC608\uC220\uB85C \uB9CC\uB4DC\uB294 \uC791\uC5C5, \uC5B4\uB514\uC11C \uC601\uAC10\uC744 \uC5BB\uB098\uC694?",
        answer: "\uD559\uAD50 \uC55E \uACE0\uBB3C\uC0C1\uC744 \uC9C0\uB098\uB2E4\uAC00 \uBC84\uB824\uC9C4 \uCCA0\uADFC\uB4E4\uC774 \uD587\uBE5B\uC5D0 \uBC18\uC0AC\uB418\uB294 \uAC78 \uBD24\uC5B4\uC694. \uADF8 \uC21C\uAC04 \uC774 '\uC8FD\uC740' \uC7AC\uB8CC\uB4E4\uC774 \uC0B4\uC544\uC788\uB294 \uC0DD\uBA85\uCCB4\uC758 \uC138\uD3EC\uCC98\uB7FC \uBCF4\uC600\uC5B4\uC694. \uBC15\uD14C\uB9AC\uC544, \uC544\uBA54\uBC14 \uAC19\uC740 \uBBF8\uC2DC \uC138\uACC4\uC758 \uC720\uAE30\uCCB4\uB4E4\uC774 \uC81C \uC870\uAC01\uC758 \uCD9C\uBC1C\uC810\uC785\uB2C8\uB2E4."
      },
      {
        question: "\uC11D\uC0AC\uC0DD\uC73C\uB85C\uC11C \uC791\uD488\uC744 \uD310\uB9E4\uD558\uB294 \uACBD\uD5D8\uC740 \uC5B4\uB5A4\uAC00\uC694?",
        answer: "\uC194\uC9C1\uD788 \uB9D0\uD558\uBA74 \uC0DD\uD65C\uBE44\uC5D0\uB3C4 \uB3C4\uC6C0\uC774 \uB418\uACE0\uC694(\uC6C3\uC74C). \uBB34\uC5C7\uBCF4\uB2E4 \uC791\uD488\uC774 \uC2E4\uC81C\uB85C \uB204\uAD70\uAC00\uC5D0\uAC8C \uAC00\uB294 \uACBD\uD5D8 \uC790\uCCB4\uAC00 \uCC3D\uC791\uC758 \uB3D9\uB825\uC774 \uB429\uB2C8\uB2E4. \uAD50\uC218\uB2D8 \uD53C\uB4DC\uBC31\uBCF4\uB2E4 \uAD6C\uB9E4\uC790 \uBD84\uB4E4\uC758 \uBC18\uC751\uC774 \uB354 \uC194\uC9C1\uD558\uAC70\uB4E0\uC694."
      }
    ],
    email: "minwoo_lee_art@naver.com"
  },
  {
    id: "artist_3",
    name: "\uCD5C\uB2E4\uC740 (Choi Da-eun)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "\uACC4\uC6D0\uC608\uC220\uB300\uD559\uAD50 \uC0AC\uC9C4\uACFC\uB97C \uAC13 \uC878\uC5C5\uD55C \uC2E0\uC778 \uC0AC\uC9C4\uC791\uAC00\uC785\uB2C8\uB2E4. \uC878\uC5C5 \uD6C4 1\uB144\uC9F8 \uBC18\uC9C0\uD558 \uC791\uC5C5\uC2E4\uC5D0\uC11C \uD63C\uC790 \uD544\uB984\uC744 \uD604\uC0C1\uD558\uBA70 \uC791\uC5C5 \uC911\uC785\uB2C8\uB2E4. \uBC24\uC758 \uB3C4\uC2DC\uC640 \uBE5B\uC758 \uC794\uC0C1\uC744 \uC8FC\uB85C \uB2F4\uC73C\uBA70, \uC544\uC9C1 \uACF5\uBAA8\uC804 \uC218\uC0C1 \uACBD\uB825\uC740 \uC5C6\uC9C0\uB9CC \uC790\uC2E0\uB9CC\uC758 \uAC10\uAC01\uC744 \uC870\uAE08\uC529 \uB2E4\uB4EC\uC5B4\uAC00\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    keywords: ["\uD544\uB984", "\uC57C\uACBD", "\uBE5B", "\uBABD\uD658", "\uB3C4\uC2DC", "\uC0AC\uC9C4", "\uD751\uBC31"],
    interviewQuestions: [
      {
        question: "\uC878\uC5C5 \uD6C4 \uBC14\uB85C \uB3C5\uB9BD \uC791\uC5C5\uC744 \uC120\uD0DD\uD55C \uC774\uC720\uB294?",
        answer: "\uBCF4\uC870 \uC791\uAC00 \uC790\uB9AC\uAC00 \uC788\uC5C8\uB294\uB370, \uB2E4\uB978 \uC0AC\uB78C\uC758 \uC2A4\uD0C0\uC77C\uC744 \uB530\uB77C\uAC00\uB2E4 \uBCF4\uBA74 \uC81C \uB208\uC774 \uD750\uB824\uC9C8 \uAC83 \uAC19\uC558\uC5B4\uC694. \uB2F9\uC7A5 \uB3C8\uC774 \uC548 \uB418\uB354\uB77C\uB3C4 \uB0B4 \uBC29\uC2DD\uC73C\uB85C 1\uB144\uC744 \uBC84\uD168\uBCF4\uC790\uACE0 \uACB0\uC2EC\uD588\uC2B5\uB2C8\uB2E4. \uC544\uC9C1\uB3C4 \uBC84\uD2F0\uB294 \uC911\uC774\uC5D0\uC694(\uC6C3\uC74C)."
      },
      {
        question: "\uD544\uB984 \uC0AC\uC9C4\uC744 \uACE0\uC9D1\uD558\uB294 \uC774\uC720\uAC00 \uC788\uB098\uC694?",
        answer: "\uC2E4\uC218\uD560 \uC218 \uC5C6\uB2E4\uB294 \uAE34\uC7A5\uAC10\uC774\uC694. \uC154\uD130\uB97C \uB204\uB974\uAE30 \uC804\uC5D0 \uC815\uB9D0 \uB9CE\uC774 \uC0DD\uAC01\uD558\uAC8C \uB3FC\uC694. \uADF8 \uC2E0\uC911\uD568\uC774 \uC0AC\uC9C4\uC5D0 \uB0A8\uB294\uB2E4\uACE0 \uBBFF\uC2B5\uB2C8\uB2E4. \uB514\uC9C0\uD138\uC740 \uC218\uBC31 \uC7A5 \uCC0D\uACE0 \uACE0\uB974\uC9C0\uB9CC \uD544\uB984\uC740 \uADF8 \uC21C\uAC04\uC5D0 \uC9D1\uC911\uD558\uAC8C \uB9CC\uB4E4\uC5B4\uC694."
      }
    ],
    email: "da_eun_photo@daum.net"
  },
  {
    id: "artist_4",
    name: "\uBC15\uC9C0\uD6C8 (Park Ji-hoon)",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "\uC11C\uC6B8\uACFC\uD559\uAE30\uC220\uB300\uD559\uAD50 \uB514\uC790\uC778\uD559\uACFC\uB97C \uC878\uC5C5\uD558\uACE0 \uD63C\uC790 \uBBF8\uB514\uC5B4\uC544\uD2B8\uB97C \uB3C5\uD559 \uC911\uC778 \uC2E0\uC778 \uC791\uAC00\uC785\uB2C8\uB2E4. \uB0AE\uC5D0\uB294 \uC6F9 \uD37C\uBE14\uB9AC\uC154\uB85C \uC77C\uD558\uBA70 \uBC24\uC5D0\uB294 \uCF54\uB4DC\uB85C \uC608\uC220\uC744 \uB9CC\uB4ED\uB2C8\uB2E4. \uC54C\uACE0\uB9AC\uC998\uC774 \uB9CC\uB4E4\uC5B4\uB0B4\uB294 \uC6B0\uC5F0\uD55C \uC544\uB984\uB2E4\uC6C0\uC5D0 \uB9E4\uB8CC\uB418\uC5B4 \uC788\uC73C\uBA70, \uC0DD\uC131 \uC608\uC220\uC758 \uAC00\uB2A5\uC131\uC744 \uD0D0\uAD6C\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    keywords: ["\uB514\uC9C0\uD138", "\uC54C\uACE0\uB9AC\uC998", "\uCF54\uB529", "\uC0DD\uC131\uC608\uC220", "\uCD94\uC0C1", "\uC0C9\uCC44", "\uBBF8\uB514\uC5B4"],
    interviewQuestions: [
      {
        question: "\uB0AE\uC5D0 \uC77C\uD558\uBA74\uC11C \uBC24\uC5D0 \uC608\uC220 \uC791\uC5C5\uC744 \uD558\uB294 \uAC8C \uD798\uB4E4\uC9C0 \uC54A\uB098\uC694?",
        answer: "\uD798\uB4E4\uC8E0. \uADFC\uB370 \uD68C\uC0AC \uC77C\uB85C \uC9C0\uCCD0\uC11C \uC9D1\uC5D0 \uC640\uC11C \uCF54\uB4DC \uD55C \uC904 \uC9DC\uB2E4 \uBCF4\uBA74 \uBB54\uAC00 \uD480\uB9AC\uB294 \uB290\uB08C\uC774\uC5D0\uC694. \uB0AE\uC758 \uC2A4\uD2B8\uB808\uC2A4\uAC00 \uC624\uD788\uB824 \uC791\uC5C5\uC758 \uC5F0\uB8CC\uAC00 \uB418\uB294 \uAC83 \uAC19\uC2B5\uB2C8\uB2E4. \uADF8\uB798\uC11C \uADF8\uB7F0\uC9C0 \uC791\uD488\uB4E4\uC774 \uC880 \uC5B4\uB461\uACE0 \uB0A0\uCE74\uB86D\uB2E4\uB294 \uB9D0\uC744 \uB9CE\uC774 \uB4E4\uC5B4\uC694."
      },
      {
        question: "\uBBF8\uC220 \uC804\uACF5\uC774 \uC544\uB2CC\uB370 \uC608\uC220\uAC00\uB85C \uBD88\uB9AC\uB294 \uAC8C \uC5B4\uC0C9\uD558\uC9C0 \uC54A\uB098\uC694?",
        answer: "\uCC98\uC74C\uC5D4 \uC5B4\uC0C9\uD588\uC5B4\uC694. \uADFC\uB370 \uCF54\uB4DC\uB3C4 \uBD93\uC774\uACE0, \uD654\uBA74\uB3C4 \uCE94\uBC84\uC2A4\uC796\uC544\uC694. \uC624\uD788\uB824 '\uC544\uD2B8\uB97C \uBAA8\uB974\uB294' \uC2DC\uAC01\uC774 \uC81C \uC791\uD488\uC5D0 \uC2E0\uC120\uD568\uC744 \uC900\uB2E4\uACE0 \uBBFF\uACE0 \uC2F6\uC5B4\uC694."
      }
    ],
    email: "jihoon_codes_art@gmail.com"
  },
  {
    id: "artist_5",
    name: "\uC815\uC11C\uC6B0 (Jung Seo-woo)",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    bio: "\uAC15\uC6D0\uB300\uD559\uAD50 \uACF5\uC608\uD559\uACFC \uC11D\uC0AC\uACFC\uC815 1\uB144\uCC28\uC785\uB2C8\uB2E4. \uD759\uACFC \uC2E4, \uAE08\uC18D \uB4F1 \uC804\uD1B5 \uACF5\uC608 \uC7AC\uB8CC\uB97C \uD604\uB300\uC801 \uC870\uD615 \uC5B8\uC5B4\uB85C \uC7AC\uD574\uC11D\uD558\uB294 \uC791\uC5C5\uC744 \uD569\uB2C8\uB2E4. \uC18C\uD615 \uC624\uBE0C\uC81C\uBD80\uD130 \uB300\uD615 \uC124\uCE58 \uC870\uAC01\uAE4C\uC9C0 \uB118\uB098\uB4E4\uBA70 '\uC0B4\uC544\uC788\uB294 \uAC83\uC758 \uCD09\uAC10'\uC744 \uB9CC\uB4DC\uB294 \uC77C\uC5D0 \uC9D1\uC911\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    keywords: ["\uACF5\uC608", "\uC124\uCE58", "\uC624\uBE0C\uC81C", "\uD63C\uD569\uC7AC\uB8CC", "\uB3D9\uBB3C", "\uC2E4", "\uC2E4\uD5D8"],
    interviewQuestions: [
      {
        question: "\uB3C4\uC608\uC5D0\uC11C \uC2DC\uC791\uD574 \uB300\uD615 \uC124\uCE58 \uC870\uAC01\uAE4C\uC9C0, \uC791\uC5C5 \uC601\uC5ED\uC774 \uB113\uC5B4\uC9C4 \uACC4\uAE30\uAC00 \uC788\uB098\uC694?",
        answer: "\uC11D\uC0AC \uCCAB \uD559\uAE30\uC5D0 \uC9C0\uB3C4 \uAD50\uC218\uB2D8\uC774 '\uC7AC\uB8CC\uAC00 \uB108\uB97C \uAC00\uB450\uAC8C \uD558\uC9C0 \uB9C8\uB77C'\uACE0 \uD558\uC168\uC5B4\uC694. \uADF8 \uD55C\uB9C8\uB514\uC5D0 \uD759 \uBC16\uC73C\uB85C \uB098\uAC00\uBCF4\uAE30\uB85C \uD588\uC2B5\uB2C8\uB2E4. \uC9C0\uAE08\uC740 \uD138\uC2E4, \uAE08\uC18D \uC640\uC774\uC5B4, \uBE44\uB2D0\uAE4C\uC9C0 \uBB50\uB4E0 \uC368\uC694. \uACB0\uAD6D \uC81C\uAC00 \uD558\uACE0 \uC2F6\uC740 \uAC74 '\uC0B4\uC544\uC788\uB294 \uAC83\uC758 \uCD09\uAC10'\uC744 \uB9CC\uB4DC\uB294 \uAC70\uB2C8\uAE4C\uC694."
      },
      {
        question: "\uD770 \uD138\uB85C \uB9CC\uB4E0 \uCF54\uBFD4\uC18C \uAC19\uC740 \uC791\uD488\uC740 \uC5B4\uB5BB\uAC8C \uAD6C\uC0C1\uD558\uAC8C \uB410\uB098\uC694?",
        answer: "\uBA78\uC885\uC704\uAE30 \uB3D9\uBB3C \uB2E4\uD050\uBA58\uD130\uB9AC\uB97C \uBCF4\uB2E4\uAC00 \uD770\uCF54\uBFD4\uC18C \uC774\uC57C\uAE30\uC5D0 \uD55C\uCC38\uC744 \uC6B8\uC5C8\uC5B4\uC694. \uADF8 \uC774\uD6C4\uB85C \uC774 \uB3D9\uBB3C\uB4E4\uC744 \uAE30\uC5B5\uD558\uB294 \uC791\uD488\uC744 \uB9CC\uB4E4\uACE0 \uC2F6\uC5C8\uC2B5\uB2C8\uB2E4. \uD138\uC740 \uBD80\uB4DC\uB7FD\uC9C0\uB9CC \uADF8 \uC18D\uC5D0 \uCCA0\uC7AC \uBF08\uB300\uAC00 \uC788\uC5B4\uC694. \uC5F0\uC57D\uD568\uACFC \uAC15\uC778\uD568\uC744 \uAC19\uC774 \uB2F4\uACE0 \uC2F6\uC5C8\uAC70\uB4E0\uC694."
      }
    ],
    email: "seowoo_earth_art@gmail.com"
  }
];
var INITIAL_ARTWORKS = [
  // ── 회화 (Painting) ── artist_1 김하늘 ─────────────────────────────
  {
    id: "art_1",
    title: "\uBB3C\uD0D1\uC774 \uC788\uB294 \uC5EC\uB984 \uB0AE",
    artistId: "artist_1",
    artistName: "\uAE40\uD558\uB298 (Kim Ha-neul)",
    image: "/photos/KakaoTalk_20260629_104428985_04.jpg",
    description: "\uACE0\uD5A5 \uB9C8\uC744 \uC5B8\uB355 \uC704\uC758 \uCCB4\uCEE4\uBCF4\uB4DC \uBB34\uB2AC \uAE09\uC218\uD0D1\uC744 \uBC30\uACBD\uC73C\uB85C \uBB49\uAC8C\uAD6C\uB984\uC774 \uD53C\uC5B4\uC624\uB974\uB294 \uC5EC\uB984 \uD55C\uB0AE\uC744 \uB2F4\uC558\uC2B5\uB2C8\uB2E4. \uD654\uBA74 \uC0C1\uB2E8\uC5D0 \uB4F1\uC7A5\uD558\uB294 \uC218\uAD6D \uD654\uBD84\uC740 \uC2E4\uC81C \uCC3D\uBB38 \uBC16 \uD654\uBD84\uC744 \uADF8\uB824 \uB123\uC740 \uAC83\uC73C\uB85C, \uC77C\uC0C1\uACFC \uD48D\uACBD\uC774 \uACB9\uCCD0\uC9C0\uB294 \uC21C\uAC04\uC744 \uD3EC\uCC29\uD588\uC2B5\uB2C8\uB2E4.",
    category: "Painting",
    tags: ["\uD48D\uACBD\uD654", "\uC5EC\uB984", "\uAD6C\uB984", "\uC11C\uC815", "\uB530\uB73B\uD55C", "\uD558\uB298\uC0C9"],
    year: 2025,
    medium: "Acrylic on Canvas",
    dimensions: "72.7 x 90.9 cm (30\uD638)",
    priceRange: "\u20A91,200,000",
    featured: true
  },
  {
    id: "art_2",
    title: "\uBCC4\uBE5B \uC544\uB798\uC758 \uAD50\uAC10",
    artistId: "artist_1",
    artistName: "\uAE40\uD558\uB298 (Kim Ha-neul)",
    image: "/photos/KakaoTalk_20260629_104428985_05.png",
    description: "\uBCC4\uC790\uB9AC\uAC00 \uBE5B\uB098\uB294 \uBC24\uD558\uB298 \uC544\uB798 \uB450 \uC874\uC7AC\uAC00 \uB9C8\uC8FC\uBCF4\uBA70 \uBB34\uC5B8\uAC00\uB97C \uB098\uB204\uB294 \uC7A5\uBA74\uC744 \uC6D0\uD615 \uAD6C\uB3C4\uB85C \uB2F4\uC558\uC2B5\uB2C8\uB2E4. \uD669\uAE08\uBE5B \uAD11\uC6D0\uC5D0\uC11C \uBC88\uC838 \uB098\uC624\uB294 \uC785\uC790\uB4E4\uC774 \uB450 \uC778\uBB3C \uC8FC\uC704\uB97C \uAC10\uC2F8\uBA70 \uC5F0\uACB0\uACFC \uC628\uAE30\uC758 \uAC10\uAC01\uC744 \uC2DC\uAC01\uC801\uC73C\uB85C \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4.",
    category: "Painting",
    tags: ["\uBC24\uD558\uB298", "\uBCC4\uBE5B", "\uD669\uAE08\uC0C9", "\uB530\uB73B\uD55C", "\uC2E0\uBE44", "\uC6D0\uD615\uAD6C\uB3C4"],
    year: 2026,
    medium: "Acrylic on Canvas (Circle)",
    dimensions: "\uC9C0\uB984 80 cm",
    priceRange: "\u20A9980,000"
  },
  {
    id: "art_3",
    title: "\uACE0\uC694\uD55C \uC544\uCE68\uC758 \uD478\uB978 \uD754\uC801",
    artistId: "artist_1",
    artistName: "\uAE40\uD558\uB298 (Kim Ha-neul)",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80",
    description: "\uC0C8\uBCBD\uC548\uAC1C \uC18D\uC5D0 \uD750\uB824\uC9C0\uB294 \uAE4A\uC740 \uC0B0\uC790\uB77D\uACFC \uCCAB \uC774\uC2AC\uC5D0 \uC816\uC740 \uD478\uB978 \uB4E4\uD310\uC758 \uB300\uAE30\uB97C \uCD94\uC0C1\uD654\uD588\uC2B5\uB2C8\uB2E4. \uACB9\uACB9\uC774 \uC313\uC544 \uC62C\uB9B0 \uD558\uB298\uC0C9 \uC544\uD06C\uB9B4 \uC704\uB85C \uC587\uC740 \uC720\uD654 \uC624\uC77C\uC744 \uB367\uBC1C\uB77C \uC2E0\uBE44\uB85C\uC6B4 \uC544\uCE68\uC758 \uACF5\uAC04\uAC10\uC744 \uC5F0\uCD9C\uD588\uC2B5\uB2C8\uB2E4.",
    category: "Painting",
    tags: ["\uCC28\uBD84\uD55C", "\uD478\uB978\uC0C9", "\uC544\uCE68\uC548\uAC1C", "\uD48D\uACBD\uD654", "\uCE58\uC720", "\uC790\uC5F0"],
    year: 2026,
    medium: "Acrylic and Oil on Canvas",
    dimensions: "60.6 x 60.6 cm",
    priceRange: "\u20A9850,000"
  },
  {
    id: "art_4",
    title: "\uB178\uC744\uBE5B \uC628\uAE30\uAC00 \uBA38\uBB34\uB294 \uD574\uC548",
    artistId: "artist_1",
    artistName: "\uAE40\uD558\uB298 (Kim Ha-neul)",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    description: "\uD574\uAC00 \uC9C8 \uBB34\uB835 \uBC14\uB2E4 \uC704\uC5D0 \uBC88\uC9C0\uB294 \uC9D9\uC740 \uAC10\uD64D\uC0C9\uACFC \uBD80\uB4DC\uB7EC\uC6B4 \uBD84\uD64D\uBE5B \uB178\uC744\uC758 \uCC2C\uB780\uD55C \uC21C\uAC04\uC744 \uADF8\uB838\uC2B5\uB2C8\uB2E4. \uB450\uD130\uC6B4 \uB098\uC774\uD504 \uD130\uCE58\uB85C \uD30C\uB3C4\uC758 \uAC70\uCE5C \uD770 \uD3EC\uB9D0\uC744 \uC785\uCCB4\uC801\uC73C\uB85C \uAC15\uC870\uD558\uC5EC \uBC14\uB2E4\uC758 \uC228\uACB0\uC774 \uC190\uB05D\uC5D0 \uB2FF\uC744 \uB4EF\uD569\uB2C8\uB2E4.",
    category: "Painting",
    tags: ["\uB530\uB73B\uD55C", "\uBC14\uB2E4", "\uB178\uC744", "\uC784\uD30C\uC2A4\uD1A0", "\uD48D\uACBD\uD654", "\uBD84\uD64D"],
    year: 2025,
    medium: "Oil on Canvas",
    dimensions: "90.9 x 72.7 cm (30\uD638)",
    priceRange: "\u20A91,400,000"
  },
  // ── 조소 (Sculpture) ── artist_2 이민우 ─────────────────────────────
  {
    id: "art_5",
    title: "\uBC15\uD14C\uB9AC\uC544 (\uD074\uB85C\uC988\uC5C5)",
    artistId: "artist_2",
    artistName: "\uC774\uBBFC\uC6B0 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985.jpg",
    description: "\uD3D0\uCCA0\uC7AC\uC640 \uC6A9\uC811\uBD09\uC73C\uB85C \uBBF8\uC0DD\uBB3C \uBC15\uD14C\uB9AC\uC544\uC758 \uB0B4\uBD80 \uAD6C\uC870\uB97C \uD074\uB85C\uC988\uC5C5\uC73C\uB85C \uC7AC\uD604\uD55C \uC791\uD488\uC785\uB2C8\uB2E4. \uCCA0\uC758 \uC0B0\uD654\uC640 \uC6A9\uC811 \uC5F4\uAE30\uAC00 \uBE5A\uC5B4\uB0B8 \uBB34\uC9C0\uAC2F\uBE5B \uBC1C\uC0C9\uC774 \uC0DD\uBB3C\uD559\uC801 \uC138\uD3EC\uB9C9\uC758 \uC774\uB9AC\uB370\uC13C\uC2A4\uB97C \uC5F0\uC0C1\uC2DC\uD0B5\uB2C8\uB2E4.",
    category: "Sculpture",
    tags: ["\uAE08\uC18D", "\uC6A9\uC811", "\uC720\uAE30\uCCB4", "\uBBF8\uC0DD\uBB3C", "\uD14D\uC2A4\uCC98", "\uC0B0\uD654"],
    year: 2025,
    medium: "Welded Steel, Iron",
    dimensions: "40 x 40 cm (\uBCBD\uBA74 \uBD80\uC870)",
    priceRange: "\u20A91,800,000",
    featured: true
  },
  {
    id: "art_6",
    title: "\uBD80\uC720\uD558\uB294 \uC6D0\uB4E4 (\uB514\uD14C\uC77C)",
    artistId: "artist_2",
    artistName: "\uC774\uBBFC\uC6B0 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_01.jpg",
    description: "\uC2A4\uD14C\uC778\uB9AC\uC2A4 \uC640\uC774\uC5B4\uB97C \uAD6C\uBD80\uB824 \uD06C\uACE0 \uC791\uC740 \uD0C0\uC6D0\uD615 \uACE0\uB9AC\uB4E4\uC744 \uBB34\uD55C\uD788 \uC5F0\uACB0\uD55C \uBCBD\uBA74 \uC124\uCE58 \uC791\uD488\uC758 \uC138\uBD80 \uC7A5\uBA74\uC785\uB2C8\uB2E4. \uBE5B\uC5D0 \uB530\uB77C \uB2EC\uB77C\uC9C0\uB294 \uADF8\uB9BC\uC790\uAC00 \uBCBD\uBA74\uC5D0 \uB610 \uB2E4\uB978 \uB4DC\uB85C\uC789\uC744 \uB9CC\uB4E4\uC5B4\uB0C5\uB2C8\uB2E4.",
    category: "Sculpture",
    tags: ["\uC640\uC774\uC5B4", "\uC6D0\uD615", "\uBE5B", "\uADF8\uB9BC\uC790", "\uBBF8\uB2C8\uBA40", "\uC124\uCE58"],
    year: 2026,
    medium: "Stainless Steel Wire",
    dimensions: "\uAC00\uBCC0 \uC124\uCE58 (\uC57D 80 x 100 cm)",
    priceRange: "\u20A92,200,000"
  },
  {
    id: "art_7",
    title: "\uBC15\uD14C\uB9AC\uC544 / Bacteria",
    artistId: "artist_2",
    artistName: "\uC774\uBBFC\uC6B0 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_02.jpg",
    description: "\uB3C4\uC2DC\uC5D0\uC11C \uC218\uAC70\uD55C \uD3D0\uCCA0\uADFC\uACFC \uACE0\uCCA0\uD310\uC744 \uC6A9\uC811\uD558\uC5EC \uAC70\uB300\uD55C \uC720\uAE30\uCCB4 \uC138\uD3EC\uC758 \uD615\uD0DC\uB97C \uAD6C\uD604\uD588\uC2B5\uB2C8\uB2E4. \uD558\uC580 \uBCBD\uBA74\uC5D0 \uAC78\uB9B0 \uC870\uAC01\uC774 \uBC15\uD14C\uB9AC\uC544 \uBC30\uC591 \uC0AC\uC9C4\uCC98\uB7FC \uBCF4\uC774\uB3C4\uB85D \uC804\uCCB4 \uAD6C\uC131\uC744 \uACC4\uD68D\uD588\uC2B5\uB2C8\uB2E4.",
    category: "Sculpture",
    tags: ["\uD3D0\uCCA0\uC7AC", "\uC6A9\uC811", "\uBC15\uD14C\uB9AC\uC544", "\uC720\uAE30\uCCB4", "\uBCBD\uBA74\uC870\uAC01", "\uC785\uCCB4"],
    year: 2025,
    medium: "Welded Scrap Iron, Steel Rod",
    dimensions: "70 x 70 cm (\uBCBD\uBA74 \uBD80\uC870)",
    priceRange: "\u20A93,500,000",
    featured: true
  },
  {
    id: "art_8",
    title: "\uBD80\uC720\uD558\uB294 \uC6D0\uB4E4 / Floating Circles",
    artistId: "artist_2",
    artistName: "\uC774\uBBFC\uC6B0 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_03.jpg",
    description: "\uC218\uBC31 \uAC1C\uC758 \uC640\uC774\uC5B4 \uACE0\uB9AC\uAC00 \uC11C\uB85C\uB97C \uBD99\uC7A1\uC73C\uBA70 \uB9CC\uB4E4\uC5B4\uB0B4\uB294 \uC720\uAE30\uC801\uC778 \uB369\uC5B4\uB9AC\uB97C \uD45C\uD604\uD55C \uB300\uD615 \uBCBD\uBA74 \uC124\uCE58\uC785\uB2C8\uB2E4. \uAC00\uAE4C\uC774\uC11C \uBCF4\uBA74 \uAC01\uAC01\uC758 \uBD88\uC644\uC804\uD55C \uC6D0\uC774 \uBCF4\uC774\uACE0, \uBA40\uB9AC\uC11C \uBCF4\uBA74 \uD558\uB098\uC758 \uC0DD\uBA85\uCCB4\uCC98\uB7FC \uBCF4\uC774\uB294 \uC774\uC911\uC131\uC744 \uB2F4\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    category: "Sculpture",
    tags: ["\uC640\uC774\uC5B4", "\uC124\uCE58", "\uC774\uC911\uC131", "\uB369\uC5B4\uB9AC", "\uAE08\uC18D\uC120", "\uBCBD\uBA74"],
    year: 2026,
    medium: "Stainless Steel Wire",
    dimensions: "150 x 120 cm (\uBCBD\uBA74 \uC124\uCE58)",
    priceRange: "\u20A94,800,000"
  },
  {
    id: "art_9",
    title: "\uBD88\uAF43 \uB9C8\uC2A4\uD06C / Flame Mask",
    artistId: "artist_2",
    artistName: "\uC774\uBBFC\uC6B0 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_07.jpg",
    description: "\uAD6C\uB9AC \uC640\uC774\uC5B4\uC640 \uCCA0 \uD30C\uC774\uD504\uB97C \uC5EE\uC5B4 \uC778\uAC04 \uC5BC\uAD74\uC744 \uD615\uC0C1\uD654\uD558\uACE0, \uC704\uB85C \uCE58\uC19F\uB294 \uBD88\uAF43\uC758 \uD615\uD0DC\uB97C \uB354\uD55C \uB9C8\uC2A4\uD06C \uC870\uAC01\uC785\uB2C8\uB2E4. \uB098\uBB34 \uC6D0\uD310 \uC704\uC5D0 \uB9C8\uC6B4\uD305\uB418\uC5B4 \uBCBD\uC5D0 \uAC78\uB9AC\uB294 \uD615\uC2DD\uC73C\uB85C \uC81C\uC791\uB418\uC5C8\uC73C\uBA70, \uC778\uAC04\uC758 \uC695\uB9DD\uACFC \uC0C1\uC2B9 \uC758\uC9C0\uB97C \uD45C\uD604\uD569\uB2C8\uB2E4.",
    category: "Sculpture",
    tags: ["\uAD6C\uB9AC", "\uB9C8\uC2A4\uD06C", "\uBD88\uAF43", "\uC778\uCCB4", "\uC695\uB9DD", "\uD63C\uD569\uAE08\uC18D"],
    year: 2025,
    medium: "Copper Wire, Iron Pipe, Oak Board",
    dimensions: "35 x 28 x 60 (h) cm",
    priceRange: "\u20A92,900,000"
  },
  {
    id: "art_10",
    title: "\uC73C\uB974\uB801 / Growl",
    artistId: "artist_2",
    artistName: "\uC774\uBBFC\uC6B0 (Lee Min-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_08.jpg",
    description: "\uD3D0\uCC28 \uBD80\uD488\uC5D0\uC11C \uCD94\uCD9C\uD55C \uCCA0\uC7AC \uB760\uB97C \uC5EE\uACE0 \uC6A9\uC811\uD558\uC5EC \uC6C5\uD06C\uB9B0 \uCC44 \uC73C\uB974\uB801\uB300\uB294 \uB9F9\uC218\uC758 \uD615\uC0C1\uC744 \uB9CC\uB4E4\uC5C8\uC2B5\uB2C8\uB2E4. \uC18D\uC774 \uBE44\uC5B4\uC788\uB294 \uAD6C\uC870\uC784\uC5D0\uB3C4 \uC804\uCCB4\uC801\uC778 \uC2E4\uB8E8\uC5E3\uC740 \uAE34\uC7A5\uAC10 \uC788\uB294 \uB3D9\uBB3C\uC758 \uADFC\uC721\uAC10\uC744 \uADF8\uB300\uB85C \uC804\uB2EC\uD569\uB2C8\uB2E4.",
    category: "Sculpture",
    tags: ["\uB3D9\uBB3C", "\uCCA0\uC7AC", "\uAE34\uC7A5\uAC10", "\uC785\uCCB4\uC870\uAC01", "\uADFC\uC721", "\uACF5\uAC04\uAC10"],
    year: 2026,
    medium: "Welded Steel Strip (Reclaimed Auto Parts)",
    dimensions: "90 x 40 x 55 (h) cm",
    priceRange: "\u20A95,500,000",
    featured: true
  },
  // ── 공예/설치 (Craft) ── artist_5 정서우 ─────────────────────────────
  {
    id: "art_11",
    title: "\uC5B4\uBD80\uC758 \uAFC8 / Fisher's Dream",
    artistId: "artist_5",
    artistName: "\uC815\uC11C\uC6B0 (Jung Seo-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_06.jpg",
    description: "\uC740\uBE5B \uBE44\uC988\uC640 \uAE08\uC18D \uD540\uC73C\uB85C \uB9CC\uB4E0 \uBB3C\uACE0\uAE30 \uACE8\uACA9 \uC704\uC5D0 \uD558\uC580 \uC2E4\uD0C0\uB798\uB97C \uC5B9\uC5B4 '\uC7A1\uD614\uC9C0\uB9CC \uB193\uC778' \uC5ED\uC124\uC801 \uC21C\uAC04\uC744 \uD45C\uD604\uD588\uC2B5\uB2C8\uB2E4. \uAC80\uC740 \uB098\uBB34 \uC0C1\uC790 \uC548\uC5D0 \uBC30\uCE58\uD558\uC5EC \uD45C\uBCF8 \uBC15\uC2A4\uCC98\uB7FC \uBCF4\uC774\uB294 \uC5F0\uCD9C\uB85C, \uC790\uC5F0\uACFC \uC218\uC9D1\uC758 \uAD00\uACC4\uB97C \uD0D0\uAD6C\uD569\uB2C8\uB2E4.",
    category: "Craft",
    tags: ["\uD63C\uD569\uC7AC\uB8CC", "\uBB3C\uACE0\uAE30", "\uC2E4", "\uBE44\uC988", "\uC624\uBE0C\uC81C", "\uC124\uCE58"],
    year: 2025,
    medium: "Silver Beads, Metal Pin, Silk Thread, Wood Box",
    dimensions: "60 x 20 x 10 cm",
    priceRange: "\u20A91,100,000",
    featured: true
  },
  {
    id: "art_12",
    title: "\uBC31\uC0C9 \uC57C\uC218 I (\uCE21\uBA74) / White Beast I",
    artistId: "artist_5",
    artistName: "\uC815\uC11C\uC6B0 (Jung Seo-woo)",
    image: "/photos/KakaoTalk_20260629_104428985_09.jpg",
    description: "\uD770\uCF54\uBFD4\uC18C\uC758 \uBA78\uC885\uC744 \uC560\uB3C4\uD558\uBA70 \uC81C\uC791\uD55C \uB300\uD615 \uC124\uCE58 \uC870\uAC01\uC785\uB2C8\uB2E4. \uB0B4\uBD80 \uCCA0\uC7AC \uBF08\uB300 \uC704\uC5D0 \uD770\uC0C9 \uD328\uB354\uB9C1 \uC18C\uC7AC\uB97C \uCE35\uCE35\uC774 \uBD99\uC5EC \uC644\uC131\uD588\uC73C\uBA70, \uBC1C\uAD7D\uC740 \uAE08\uC18D \uC18C\uC7AC\uB97C \uADF8\uB300\uB85C \uB178\uCD9C\uD558\uC5EC \uC790\uC5F0\uACFC \uC778\uACF5\uC758 \uACBD\uACC4\uB97C \uB4DC\uB7EC\uB0C5\uB2C8\uB2E4.",
    category: "Craft",
    tags: ["\uC124\uCE58", "\uB3D9\uBB3C", "\uBA78\uC885\uC704\uAE30", "\uD770\uC0C9", "\uB300\uD615\uC791\uD488", "\uD63C\uD569\uC7AC\uB8CC"],
    year: 2026,
    medium: "Steel Frame, White Feathering Material, Mixed Media",
    dimensions: "180 x 80 x 120 (h) cm",
    priceRange: "\u20A98,000,000"
  },
  // ── 사진 (Photography) ── artist_3 최다은 ─────────────────────────────
  {
    id: "art_14",
    title: "\uBE5B\uC758 \uC774\uBA85 (Tinnitus of Luminescence)",
    artistId: "artist_3",
    artistName: "\uCD5C\uB2E4\uC740 (Choi Da-eun)",
    image: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&auto=format&fit=crop&q=80",
    description: "\uACF5\uC7A5\uC758 \uD654\uB824\uD55C \uC57C\uAC04 \uC804\uAE30 \uC2DC\uC124\uC5D0\uC11C \uBD84\uCD9C\uB418\uB294 \uAC15\uB82C\uD55C \uD615\uAD11 \uB098\uD2B8\uB968 \uBD88\uBE5B\uB4E4\uC744 \uACFC\uAC10\uD558\uAC8C \uB514\uD3EC\uCEE4\uC2F1\uD55C \uC2E4\uD5D8\uC801 \uD30C\uC778\uC544\uD2B8 \uC0AC\uC9C4\uC785\uB2C8\uB2E4. \uB9DD\uB9C9 \uC18D\uC5D0 \uCC0C\uB974\uB974\uD558\uACE0 \uB0A8\uB294 \uBC24\uC758 \uC5D0\uB108\uC9C0 \uC794\uC0C1\uC744 \uAE30\uB85D\uD588\uC2B5\uB2C8\uB2E4.",
    category: "Photography",
    tags: ["\uD615\uD615\uC0C9\uC0C9", "\uBE5B\uC758\uBC88\uC9D0", "\uB124\uC628\uC0AC\uC778", "\uBABD\uD658\uC801\uC778", "\uBC24\uC2DC\uAC04", "\uC7A5\uB178\uCD9C"],
    year: 2025,
    medium: "Archival Pigment Print on Hahnem\xFChle Paper",
    dimensions: "110 x 85 cm (Edition 1 of 5)",
    priceRange: "\u20A91,200,000",
    featured: true
  },
  {
    id: "art_15",
    title: "\uC624\uD6C4 \uC138 \uC2DC\uC758 \uBD80\uC7AC (The Missing 15:00)",
    artistId: "artist_3",
    artistName: "\uCD5C\uB2E4\uC740 (Choi Da-eun)",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
    description: "\uC544\uBB34\uB3C4 \uBA38\uBB3C\uC9C0 \uC54A\uB294 \uD654\uC774\uD2B8 \uD1A4\uC758 \uB2E8\uCE78\uBC29 \uAD6C\uC11D, \uC2A4\uD0E0\uB4DC \uB4F1 \uD558\uB098\uAC00 \uCF1C\uC838 \uC788\uACE0 \uD587\uBE5B\uC774 \uAC00\uB298\uAC8C \uBB38\uD2C8\uC73C\uB85C \uBD80\uC11C\uC9C0\uB294 \uAD6C\uB3C4\uB97C \uB2F4\uC740 \uACE0\uC694 \uAE30\uB958\uC758 \uC2E4\uB0B4 \uC0AC\uC9C4\uC785\uB2C8\uB2E4.",
    category: "Photography",
    tags: ["\uACE0\uC694\uD55C", "\uC815\uC801\uC778", "\uBBF8\uB2C8\uBA40", "\uBC29\uC548", "\uC678\uB85C\uC6C0", "\uC790\uC5F0\uAD11"],
    year: 2026,
    medium: "Silver Gelatin Print on Baryta Paper",
    dimensions: "80 x 80 cm (Edition 3 of 10)",
    priceRange: "\u20A9950,000"
  },
  {
    id: "art_16",
    title: "\uC0C8\uBCBD \uC138 \uC2DC\uC758 \uD3B8\uC758\uC810",
    artistId: "artist_3",
    artistName: "\uCD5C\uB2E4\uC740 (Choi Da-eun)",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=80",
    description: "\uC0C8\uBCBD \uC138 \uC2DC, \uC548\uAC1C \uC18D \uB3C4\uC2DC\uC758 \uBD88\uBE5B\uC774 \uBC88\uC838\uB098\uC624\uB294 \uAC70\uB9AC \uD48D\uACBD\uC744 \uD544\uB984 \uCE74\uBA54\uB77C\uB85C \uB2F4\uC558\uC2B5\uB2C8\uB2E4. \uB3C4\uC2DC\uC758 \uBD88\uBA74\uACFC \uB3C4\uC2DC\uC778\uC758 \uACE0\uB3C5\uC744 \uD544\uB984 \uD2B9\uC720\uC758 \uC785\uC790\uAC10\uC73C\uB85C \uD3EC\uCC29\uD55C \uC0AC\uC9C4 \uC5F0\uC791\uC758 \uD55C \uC7A5\uBA74\uC785\uB2C8\uB2E4.",
    category: "Photography",
    tags: ["\uB3C4\uC2DC", "\uC0C8\uBCBD", "\uD544\uB984", "\uC678\uB85C\uC6C0", "\uBE5B", "\uC57C\uACBD"],
    year: 2026,
    medium: "35mm Film, Archival Pigment Print",
    dimensions: "60 x 40 cm (Edition 5 of 10)",
    priceRange: "\u20A9680,000"
  },
  {
    id: "art_17",
    title: "\uC548\uAC1C\uAC00 \uC0BC\uD0A8 \uACE8\uBAA9",
    artistId: "artist_3",
    artistName: "\uCD5C\uB2E4\uC740 (Choi Da-eun)",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80",
    description: "\uC774\uB978 \uC544\uCE68 \uC548\uAC1C\uAC00 \uAC77\uD788\uAE30 \uC804 \uACE8\uBAA9\uAE38\uC744 \uB2F4\uC740 \uC7A5\uB178\uCD9C \uD544\uB984 \uC0AC\uC9C4\uC785\uB2C8\uB2E4. \uAC00\uB85C\uB4F1 \uBD88\uBE5B\uC774 \uC548\uAC1C\uC5D0 \uBC88\uC9C0\uBA70 \uB9CC\uB4E4\uC5B4\uB0B4\uB294 \uBE5B\uC758 \uD6C4\uAD11\uC774 \uACE0\uC694\uD55C \uC544\uB984\uB2E4\uC6C0\uACFC \uC4F8\uC4F8\uD568\uC744 \uB3D9\uC2DC\uC5D0 \uC790\uC544\uB0C5\uB2C8\uB2E4.",
    category: "Photography",
    tags: ["\uC548\uAC1C", "\uACE8\uBAA9", "\uC7A5\uB178\uCD9C", "\uACE0\uC694", "\uBE5B", "\uC0C8\uBCBD"],
    year: 2025,
    medium: "Medium Format Film, Archival Pigment Print",
    dimensions: "90 x 70 cm (Edition 2 of 5)",
    priceRange: "\u20A91,050,000"
  },
  // ── 미디어 아트 (Media Art) ── artist_4 박지훈 ────────────────────────
  {
    id: "art_18",
    title: "\uC5FC\uC0C9\uCCB4 \uC54C\uACE0\uB9AC\uC998 07B (Generative Fluids)",
    artistId: "artist_4",
    artistName: "Park Ji-hoon (\uBC15\uC9C0\uD6C8)",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80",
    description: "\uAD00\uB78C\uAC1D\uC758 \uC218\uB3D9\uC801 \uC81C\uC2A4\uCC98 \uC2E0\uD638\uB97C \uC720\uCCB4 \uC5ED\uD559 \uADF8\uB798\uD53D \uCE74\uB4DC \uC18C\uC2A4 \uCF54\uB4DC\uC640 \uC5F0\uB3D9\uD558\uC5EC \uC2E4\uC2DC\uAC04\uC73C\uB85C \uD758\uB7EC\uB0B4\uB9AC\uB3C4\uB85D \uC81C\uC791\uD55C \uBBF8\uB514\uC5B4\uC544\uD2B8\uC758 \uACE0\uD574\uC0C1\uB3C4 \uC778\uC1C4 \uACE0\uC815 \uD504\uB808\uC784 \uBCF8\uD310\uC785\uB2C8\uB2E4. \uC720\uAE30\uBB3C \uAC19\uC740 \uAE30\uBB18\uD55C \uC0C9\uAD11 \uC870\uD569\uC744 \uBC1C\uC0B0\uD569\uB2C8\uB2E4.",
    category: "Media Art",
    tags: ["\uB514\uC9C0\uD138", "\uC54C\uACE0\uB9AC\uC998", "\uB124\uC628", "\uC720\uCCB4", "\uD615\uD615\uC0C9\uC0C9", "\uB2E4\uC774\uB0B4\uBBF9"],
    year: 2025,
    medium: "Generative Art Frame / High Gloss Acrylic Face-mount Print",
    dimensions: "100 x 100 cm (Edition 1 of 3)",
    priceRange: "\u20A93,100,000",
    featured: true
  },
  {
    id: "art_19",
    title: "\uCE68\uBB35 \uC18D\uC5D0 \uBC88\uC2DD\uD558\uB294 \uC815\uAD50\uD55C \uC120\uB4E4",
    artistId: "artist_4",
    artistName: "Park Ji-hoon (\uBC15\uC9C0\uD6C8)",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80",
    description: "\uB178\uC774\uC988 \uC54C\uACE0\uB9AC\uC998\uC744 \uBC18\uBCF5 \uC801\uCE35\uD558\uC5EC \uC218\uBC31\uB9CC \uAC1C\uC758 \uBBF8\uC138\uAE30\uD558\uD559\uC801 \uD751\uBC31 \uC2E4\uC120\uB4E4\uC774 \uC6D0 \uBAA8\uC591\uC758 \uB3D9\uC2EC\uC6D0\uC744 \uD0C0\uACE0 \uC18C\uC6A9\uB3CC\uC774\uCE58\uAC8C \uC5F0\uCD9C\uD55C \uBBF8\uB514\uC5B4 \uC2A4\uD2F8 \uC791\uC5C5\uC785\uB2C8\uB2E4. \uBB34\uD55C\uD788 \uBC18\uBCF5\uB418\uB294 \uC218\uD559\uC801 \uD504\uB799\uD0C8 \uC790\uC5F0\uC744 \uD45C\uC0C1\uD569\uB2C8\uB2E4.",
    category: "Media Art",
    tags: ["\uBBF8\uB2C8\uBA40", "\uC54C\uACE0\uB9AC\uC998", "\uD751\uBC31", "\uC6D0\uD615", "\uB514\uC9C0\uD138\uC544\uD2B8", "\uC815\uC801\uC120"],
    year: 2026,
    medium: "UltraChrome Gicl\xE9e Print on Fine Art Canvas",
    dimensions: "150 x 100 cm",
    priceRange: "\u20A92,200,000"
  }
];

// server.ts
import_dotenv.default.config();
var DATA_FILE = import_path.default.join(process.cwd(), "_server_data.json");
function loadPersistedData() {
  try {
    if (import_fs.default.existsSync(DATA_FILE)) {
      const raw = import_fs.default.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(raw);
      console.log(`[Data] \uC800\uC7A5\uB41C \uB370\uC774\uD130 \uB85C\uB4DC \uC644\uB8CC \u2014 artists:${data.artists?.length ?? 0}, artworks:${data.artworks?.length ?? 0}, inquiries:${data.inquiries?.length ?? 0}, messages:${data.chatMessages?.length ?? 0}`);
      return data;
    }
  } catch (e) {
    console.warn("[Data] \uC800\uC7A5 \uD30C\uC77C \uB85C\uB4DC \uC2E4\uD328, \uC2DC\uB4DC \uB370\uC774\uD130\uB85C \uCD08\uAE30\uD654\uD569\uB2C8\uB2E4:", e);
  }
  return null;
}
function saveData() {
  const payload = { artists, artworks, inquiries, chatMessages, payments };
  try {
    import_fs.default.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.error("[Data] \uC800\uC7A5 \uC2E4\uD328:", err);
  }
}
var persisted = loadPersistedData();
var artists = persisted?.artists?.length ? persisted.artists : [...INITIAL_ARTISTS];
var artworks = persisted?.artworks?.length ? persisted.artworks : [...INITIAL_ARTWORKS];
var inquiries = persisted?.inquiries ?? [];
var chatMessages = persisted?.chatMessages ?? [];
var payments = persisted?.payments ?? [];
function localRuleBasedSearch(query) {
  const normQuery = query.toLowerCase().trim();
  const matchedTags = [];
  const terms = [
    { key: "\uB530\uB73B\uD55C", tags: ["\uB530\uB73B\uD55C", "\uBD84\uD64D", "\uB178\uC744", "\uD06C\uB9BC\uC0C9"] },
    { key: "\uCC28\uBD84\uD55C", tags: ["\uCC28\uBD84\uD55C", "\uACE0\uC694\uD55C", "\uC815\uC801\uC778", "\uC218\uCC44\uB290\uB08C"] },
    { key: "\uBC14\uB2E4", tags: ["\uBC14\uB2E4", "\uBB3C\uC131", "\uD48D\uACBD\uD654"] },
    { key: "\uD48D\uACBD", tags: ["\uD48D\uACBD\uD654", "\uD48D\uACBD", "\uC790\uC5F0\uC0B0", "\uC544\uCE68\uC548\uAC1C"] },
    { key: "\uAE30\uD558\uD559", tags: ["\uAE30\uD558\uD559", "\uCCA0\uC870", "\uBBF8\uB2C8\uBA40", "\uAD6C\uC870\uC801"] },
    { key: "\uBBF8\uB2C8\uBA40", tags: ["\uBBF8\uB2C8\uBA40", "\uBB34\uCC44\uC0C9", "\uC815\uC801\uC120"] },
    { key: "\uBABD\uD658", tags: ["\uBABD\uD658\uC801\uC778", "\uBE5B\uC758\uBC88\uC9D0", "\uC7A5\uB178\uCD9C", "\uB3C4\uC2DC\uC57C\uACBD"] },
    { key: "\uACF5\uC608", tags: ["\uACF5\uC608", "\uB3C4\uC608", "\uC624\uBE0C\uC81C", "\uB300\uC9C0\uC758\uC9C8\uAC10", "\uC18C\uBC15\uD55C"] },
    { key: "\uB514\uC9C0\uD138", tags: ["\uB514\uC9C0\uD138", "\uC54C\uACE0\uB9AC\uC998", "\uB124\uC628", "\uD615\uD615\uC0C9\uC0C9"] },
    { key: "\uB124\uC628", tags: ["\uB124\uC628\uC0AC\uC778", "\uB124\uC628", "\uD615\uD615\uC0C9\uC0C9"] }
  ];
  for (const item of terms) {
    if (normQuery.includes(item.key)) {
      matchedTags.push(...item.tags);
    }
  }
  const tags = Array.from(new Set(matchedTags));
  if (tags.length === 0) {
    tags.push("\uD48D\uACBD\uD654", "\uACE0\uC694\uD55C", "\uCD94\uC0C1");
  }
  const matches = artworks.map((art) => {
    let score = 0;
    const reasons = [];
    const matchingTags = art.tags.filter((t) => tags.includes(t));
    if (matchingTags.length > 0) {
      score += matchingTags.length * 4;
      reasons.push(`\uC791\uD488\uC758 \uD0A4\uC6CC\uB4DC [${matchingTags.join(", ")}]\uAC00 \uAC80\uC0C9 \uC694\uCCAD\uACFC \uC5B4\uC6B8\uB9BD\uB2C8\uB2E4.`);
    }
    if (art.title.toLowerCase().includes(normQuery)) {
      score += 10;
      reasons.push("\uC791\uD488 \uC81C\uBAA9\uC5D0 \uAC80\uC0C9 \uB2E8\uC5B4\uAC00 \uC9C1\uC811 \uD3EC\uD568\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    }
    const descMatches = [
      { word: "\uB530\uB73B", desc: "\uB530\uB73B\uD558\uACE0 \uC628\uD654\uD55C \uBD84\uC704\uAE30" },
      { word: "\uCC28\uBD84", desc: "\uCC28\uBD84\uD558\uACE0 \uACE0\uC694\uD55C \uD734\uC2DD\uC758 \uAC10\uAC01" },
      { word: "\uBC14\uB2E4", desc: "\uD478\uB974\uB978 \uBC14\uB2E4\uC758 \uC2EC\uC0C1" },
      { word: "\uACE0\uC694", desc: "\uACE0\uC694\uC640 \uCE68\uBB35 \uC18D \uCE58\uC720\uC758 \uD798" },
      { word: "\uACF5\uC608", desc: "\uC18C\uBC15\uD55C \uACF5\uC608\uD488 \uD2B9\uC720\uC758 \uC18C\uB2F4\uD55C \uBBF8\uD559" },
      { word: "\uB514\uC9C0\uD138", desc: "\uC2A4\uC2A4\uB85C \uC99D\uC2DD\uD558\uB294 \uB514\uC9C0\uD138\uC801 \uD604\uB300\uC131" },
      { word: "\uAE30\uD558", desc: "\uAD6C\uC870\uC801\uC774\uACE0 \uC815\uBC00\uD55C \uAE30\uD558\uD559\uC801 \uADF8\uB9AC\uB4DC" }
    ];
    for (const dm of descMatches) {
      if (normQuery.includes(dm.word) && art.description.includes(dm.word)) {
        score += 3;
        reasons.push(dm.desc);
      }
    }
    if (normQuery.includes("\uADF8\uB9BC") || normQuery.includes("\uD68C\uD654") || normQuery.includes("\uD398\uC778\uD305")) {
      if (art.category === "Painting") {
        score += 2;
        reasons.push("\uC694\uCCAD\uD558\uC2E0 \uD68C\uD654(\uD398\uC778\uD305) \uB9E4\uCCB4\uB97C \uCD5C\uC6B0\uC120 \uCD94\uCC9C\uD569\uB2C8\uB2E4.");
      }
    }
    if (normQuery.includes("\uC870\uC18C") || normQuery.includes("\uC870\uC2DD") || normQuery.includes("\uC870\uAC01")) {
      if (art.category === "Sculpture") {
        score += 2;
        reasons.push("\uC694\uCCAD\uD558\uC2E0 3\uCC28\uC6D0 \uC870\uAC01/\uC870\uC18C \uC785\uCCB4\uB97C \uCD5C\uC6B0\uC120 \uCD94\uCC9C\uD569\uB2C8\uB2E4.");
      }
    }
    if (normQuery.includes("\uC0AC\uC9C4") || normQuery.includes("\uD3EC\uD1A0")) {
      if (art.category === "Photography") {
        score += 2;
        reasons.push("\uC694\uCCAD\uD558\uC2E0 \uC2DC\uAC01\uC801 \uC11C\uC815\uC131\uC774 \uAC00\uB4DD\uD55C \uD30C\uC778\uC544\uD2B8 \uC0AC\uC9C4 \uC791\uD488\uC744 \uC6B0\uC120 \uB9E4\uCE6D\uD569\uB2C8\uB2E4.");
      }
    }
    if (normQuery.includes("\uB514\uC9C0\uD138") || normQuery.includes("\uBBF8\uB514\uC5B4") || normQuery.includes("\uCEF4\uD4E8\uD130")) {
      if (art.category === "Media Art") {
        score += 2;
        reasons.push("\uC694\uCCAD\uD558\uC2E0 \uC0DD\uB3D9\uD558\uB294 \uB274\uBBF8\uB514\uC5B4 \uC544\uD2B8 \uC7A5\uB974\uC640 \uBD80\uD569\uD569\uB2C8\uB2E4.");
      }
    }
    if (normQuery.includes("\uADF8\uB987") || normQuery.includes("\uB3C4\uC790\uAE30") || normQuery.includes("\uACF5\uC608")) {
      if (art.category === "Craft") {
        score += 2;
        reasons.push("\uB300\uC9C0\uC758 \uB530\uB73B\uD55C \uAC10\uAC01\uC774 \uB2F4\uAE34 \uC218\uC81C \uACF5\uC608 \uB9E4\uCE6D\uC785\uB2C8\uB2E4.");
      }
    }
    const fallbackReason = reasons.length > 0 ? reasons.join(" ") : "\uC791\uD488\uC774 \uC9C0\uB2CC \uB3C5\uCC3D\uC801\uC774\uACE0 \uD3B8\uC548\uD55C \uC2AC\uB808\uC774\uD2B8 \uD48D\uC758 \uAC10\uAC01\uC774 \uAC10\uC0C1 \uD658\uACBD\uC5D0 \uC5B4\uC6B8\uB9BD\uB2C8\uB2E4.";
    return {
      id: art.id,
      score,
      reason: fallbackReason
    };
  });
  let sortedMatches = matches.sort((a, b) => b.score - a.score);
  const matchedArtworkIds = sortedMatches.filter((m) => m.score > 0).map((m) => m.id);
  const finalMatchedIds = matchedArtworkIds.length > 0 ? matchedArtworkIds : sortedMatches.slice(0, 3).map((m) => m.id);
  const explanations = {};
  for (const m of sortedMatches) {
    if (finalMatchedIds.includes(m.id)) {
      explanations[m.id] = m.reason;
    }
  }
  return {
    tags,
    matchedArtworkIds: finalMatchedIds,
    explanations
  };
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = Number(process.env.PORT) || 3e3;
  app.use(import_express.default.json({ limit: "20mb" }));
  app.use("/photos", import_express.default.static(import_path.default.join(process.cwd(), "PHOTO")));
  app.use((req, res, next) => {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173,http://localhost:3000").split(",");
    const origin = req.headers.origin ?? "";
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    }
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/api/debug", (req, res) => {
    const distPath = import_path.default.join(process.cwd(), "dist");
    res.json({
      node: process.version,
      cwd: process.cwd(),
      NODE_ENV: process.env.NODE_ENV ?? "(unset)",
      PORT: process.env.PORT ?? "(unset)",
      distExists: import_fs.default.existsSync(distPath),
      indexExists: import_fs.default.existsSync(import_path.default.join(distPath, "index.html")),
      serverCjsExists: import_fs.default.existsSync(import_path.default.join(distPath, "server.cjs"))
    });
  });
  app.get("/api/artworks", (req, res) => {
    res.json(artworks);
  });
  app.get("/api/artworks/:id", (req, res) => {
    const art = artworks.find((a) => a.id === req.params.id);
    if (!art) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    res.json(art);
  });
  app.post("/api/artworks", (req, res) => {
    const { title, artistId, artistName, image, description, category, tags, year, medium, dimensions, priceRange } = req.body;
    if (!title || !artistId || !artistName || !image) {
      return res.status(400).json({ error: "Missing required artwork fields" });
    }
    const newArtwork = {
      id: `art_user_${Date.now()}`,
      title,
      artistId,
      artistName,
      image,
      description: description || "\uC791\uAC00\uC758 \uD2B9\uBCC4\uD55C \uC791\uAC00 \uB178\uD2B8\uC640 \uC124\uBA85\uC774 \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4.",
      category: category || "Painting",
      tags: tags && Array.isArray(tags) ? tags : ["\uAE30\uD0C0"],
      year: year || (/* @__PURE__ */ new Date()).getFullYear(),
      medium: medium || "Mixed Media",
      dimensions: dimensions || "\uAC00\uBCC0 \uD06C\uAE30",
      priceRange: priceRange || "\uAC00\uACA9 \uBB38\uC758"
    };
    artworks.unshift(newArtwork);
    saveData();
    res.status(201).json(newArtwork);
  });
  app.delete("/api/artworks/:id", (req, res) => {
    const initialLength = artworks.length;
    artworks = artworks.filter((art) => art.id !== req.params.id);
    if (artworks.length === initialLength) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    saveData();
    res.json({ success: true, message: "Artwork deleted successfully" });
  });
  app.put("/api/artworks/:id", (req, res) => {
    const index = artworks.findIndex((art) => art.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    const { title, description, category, tags, year, medium, dimensions, priceRange, image, featured } = req.body;
    const patch = {};
    if (title !== void 0) patch.title = title;
    if (description !== void 0) patch.description = description;
    if (category !== void 0) patch.category = category;
    if (tags !== void 0) patch.tags = tags;
    if (year !== void 0) patch.year = year;
    if (medium !== void 0) patch.medium = medium;
    if (dimensions !== void 0) patch.dimensions = dimensions;
    if (priceRange !== void 0) patch.priceRange = priceRange;
    if (image !== void 0) patch.image = image;
    if (featured !== void 0) patch.featured = featured;
    artworks[index] = { ...artworks[index], ...patch };
    saveData();
    res.json(artworks[index]);
  });
  app.get("/api/artists", (req, res) => {
    res.json(artists);
  });
  app.get("/api/artists/:id", (req, res) => {
    let artist = artists.find((a) => a.id === req.params.id);
    if (!artist) {
      artist = {
        id: req.params.id,
        name: "\uC791\uAC00",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio: "\uC0C8\uB85C \uAC00\uC785\uD55C \uC791\uAC00\uC785\uB2C8\uB2E4. \uD504\uB85C\uD544\uC744 \uCC44\uC6CC \uB098\uB97C \uC18C\uAC1C\uD574\uBCF4\uC138\uC694.",
        keywords: ["\uC5F4\uC815", "\uB3C5\uCC3D\uC801"],
        interviewQuestions: [
          {
            question: "\uC65C \uC791\uC5C5\uC744 \uC2DC\uC791\uD558\uAC8C \uB418\uC5C8\uB098\uC694?",
            answer: "\uC138\uC0C1\uC5D0 \uB098\uB9CC\uC758 \uC608\uC220\uC801 \uC9C0\uD45C\uB97C \uC2EC\uC5B4 \uB2E4\uB978 \uC0AC\uB78C\uB4E4\uACFC \uC18C\uD1B5\uD558\uAE30 \uC704\uD574\uC11C\uC785\uB2C8\uB2E4."
          }
        ],
        email: "artist_contact@artspatform.com"
      };
      artists.push(artist);
      saveData();
    }
    res.json(artist);
  });
  app.put("/api/artists/:id", (req, res) => {
    const { name, avatar, bio, keywords, interviewQuestions, email, card, profileBlocks } = req.body;
    const index = artists.findIndex((a) => a.id === req.params.id);
    if (index === -1) {
      const newArtist = {
        id: req.params.id,
        name: name || "\uC2E0\uBB34\uBA85\uC791\uAC00",
        avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio: bio || "",
        keywords: keywords || [],
        interviewQuestions: interviewQuestions || [],
        email: email || "artist@artsplatform.com"
      };
      artists.push(newArtist);
      saveData();
      return res.json(newArtist);
    }
    const patch = {};
    if (name !== void 0) patch.name = name;
    if (avatar !== void 0) patch.avatar = avatar;
    if (bio !== void 0) patch.bio = bio;
    if (keywords !== void 0) patch.keywords = keywords;
    if (interviewQuestions !== void 0) patch.interviewQuestions = interviewQuestions;
    if (email !== void 0) patch.email = email;
    if (card !== void 0) patch.card = card;
    if (profileBlocks !== void 0) patch.profileBlocks = profileBlocks;
    artists[index] = { ...artists[index], ...patch };
    saveData();
    res.json(artists[index]);
  });
  app.post("/api/inquiries", (req, res) => {
    const { artworkId, artworkTitle, artworkImage, artistId, artistName, buyerName, buyerEmail, message } = req.body;
    if (!artworkId || !artistId || !buyerName || !buyerEmail || !message) {
      return res.status(400).json({ error: "Missing required inquiry fields" });
    }
    const inquiryId = `inquiry_${Date.now()}`;
    const newInquiry = {
      id: inquiryId,
      artworkId,
      artworkTitle: artworkTitle || "\uBB34\uC81C \uC791\uD488",
      artworkImage: artworkImage || "",
      artistId,
      artistName: artistName || "\uC791\uAC00",
      buyerName,
      buyerEmail,
      message,
      status: "\uBB38\uC758\uC911",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    inquiries.push(newInquiry);
    const initMsg = {
      id: `msg_${Date.now()}_init`,
      inquiryId,
      senderEmail: buyerEmail,
      senderName: buyerName,
      senderRole: "buyer",
      content: message,
      sentAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    chatMessages.push(initMsg);
    saveData();
    res.status(201).json(newInquiry);
  });
  const VALID_STATUSES = ["\uBB38\uC758\uC911", "\uAC70\uB798\uC911", "\uAC70\uB798\uC644\uB8CC", "\uCDE8\uC18C"];
  app.put("/api/inquiries/:id/status", (req, res) => {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: "\uC720\uD6A8\uD558\uC9C0 \uC54A\uC740 \uAC70\uB798 \uC0C1\uD0DC\uC785\uB2C8\uB2E4." });
    }
    const index = inquiries.findIndex((i) => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Inquiry not found" });
    inquiries[index] = { ...inquiries[index], status };
    const statusLabels = {
      \uAC70\uB798\uC911: "\uAC70\uB798\uAC00 \uC2DC\uC791\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC791\uAC00\uC640 \uC790\uC720\uB86D\uAC8C \uC18C\uD1B5\uD574 \uBCF4\uC138\uC694.",
      \uAC70\uB798\uC644\uB8CC: "\uAC70\uB798\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uAC10\uC0AC\uD569\uB2C8\uB2E4!",
      \uCDE8\uC18C: "\uAC70\uB798\uAC00 \uCDE8\uC18C\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    };
    const label = statusLabels[status];
    if (label) {
      chatMessages.push({
        id: `msg_sys_${Date.now()}`,
        inquiryId: req.params.id,
        senderEmail: "system",
        senderName: "\uC2DC\uC2A4\uD15C",
        senderRole: "system",
        content: label,
        sentAt: (/* @__PURE__ */ new Date()).toISOString(),
        messageType: "system"
      });
    }
    saveData();
    res.json(inquiries[index]);
  });
  app.get("/api/chat/rooms", (req, res) => {
    const { buyerEmail, artistId } = req.query;
    const filtered = inquiries.filter((inq) => {
      if (buyerEmail && inq.buyerEmail === buyerEmail) return true;
      if (artistId && inq.artistId === artistId) return true;
      return false;
    });
    const enriched = filtered.map((room) => {
      const roomMsgs = chatMessages.filter((m) => m.inquiryId === room.id).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
      const lastMsg = roomMsgs[0];
      return {
        ...room,
        lastMessage: lastMsg?.content,
        lastMessageAt: lastMsg?.sentAt
      };
    });
    enriched.sort((a, b) => {
      const aTime = new Date(a.lastMessageAt ?? a.createdAt).getTime();
      const bTime = new Date(b.lastMessageAt ?? b.createdAt).getTime();
      return bTime - aTime;
    });
    res.json(enriched);
  });
  app.get("/api/chat/:inquiryId/messages", (req, res) => {
    const msgs = chatMessages.filter((m) => m.inquiryId === req.params.inquiryId).sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
    res.json(msgs);
  });
  app.post("/api/chat/:inquiryId/messages", (req, res) => {
    const { senderEmail, senderName, senderRole, content, messageType, estimate } = req.body;
    if (!senderEmail || !content) {
      return res.status(400).json({ error: "Missing required message fields" });
    }
    const msg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      inquiryId: req.params.inquiryId,
      senderEmail,
      senderName,
      senderRole: senderRole || "buyer",
      content,
      sentAt: (/* @__PURE__ */ new Date()).toISOString(),
      ...messageType && { messageType },
      ...estimate && { estimate }
    };
    chatMessages.push(msg);
    saveData();
    res.status(201).json(msg);
  });
  app.put("/api/chat/:inquiryId/messages/:msgId/estimate", (req, res) => {
    const { inquiryId, msgId } = req.params;
    const { response } = req.body;
    if (!["accepted", "rejected"].includes(response)) {
      return res.status(400).json({ error: "Invalid response value" });
    }
    const msg = chatMessages.find((m) => m.id === msgId && m.inquiryId === inquiryId);
    if (!msg) return res.status(404).json({ error: "Message not found" });
    if (msg.messageType !== "estimate" || !msg.estimate) {
      return res.status(400).json({ error: "Not an estimate message" });
    }
    if (msg.estimate.status !== "pending") {
      return res.status(400).json({ error: "Estimate already responded" });
    }
    msg.estimate.status = response;
    msg.estimate.respondedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (response === "accepted") {
      const inq = inquiries.find((i) => i.id === inquiryId);
      if (inq && inq.status === "\uBB38\uC758\uC911") {
        inq.status = "\uAC70\uB798\uC911";
        inq.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      }
    }
    saveData();
    res.json(msg);
  });
  app.get("/api/payments/inquiry/:inquiryId", (req, res) => {
    const payment = payments.find((p) => p.inquiryId === req.params.inquiryId);
    if (!payment) return res.status(404).json({ error: "\uACB0\uC81C \uC815\uBCF4 \uC5C6\uC74C" });
    res.json(payment);
  });
  app.post("/api/payments", (req, res) => {
    const { inquiryId, estimateNo, artworkTitle, artistName, buyerEmail, totalPrice, depositRate } = req.body;
    if (!inquiryId || !buyerEmail || !totalPrice) {
      return res.status(400).json({ error: "\uD544\uC218 \uD56D\uBAA9 \uB204\uB77D" });
    }
    const existing = payments.find((p) => p.inquiryId === inquiryId);
    if (existing) return res.status(409).json({ error: "\uC774\uBBF8 \uACB0\uC81C\uAC00 \uC9C4\uD589 \uC911\uC785\uB2C8\uB2E4" });
    const rate = Number(depositRate) || 0;
    const depositAmt = rate > 0 ? Math.round(Number(totalPrice) * (rate / 100)) : Number(totalPrice);
    const finalAmt = rate > 0 ? Number(totalPrice) - depositAmt : 0;
    const payment = {
      id: `pay_${Date.now()}`,
      inquiryId,
      estimateNo: estimateNo || "",
      artworkTitle: artworkTitle || "",
      artistName: artistName || "",
      buyerEmail,
      totalPrice: Number(totalPrice),
      depositRate: rate,
      depositAmount: depositAmt,
      finalAmount: finalAmt,
      escrowStatus: "deposit_held",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      depositPaidAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    payments.push(payment);
    const amtLabel = rate > 0 ? `\uACC4\uC57D\uAE08 ${depositAmt.toLocaleString("ko-KR")}\uC6D0 (${rate}%)` : `\uC804\uC561 ${depositAmt.toLocaleString("ko-KR")}\uC6D0`;
    const remainLabel = rate > 0 ? ` \xB7 \uC794\uAE08 ${finalAmt.toLocaleString("ko-KR")}\uC6D0\uC740 \uC791\uD488 \uC218\uB839 \uD6C4 \uACB0\uC81C` : "";
    chatMessages.push({
      id: `msg_pay_${Date.now()}`,
      inquiryId,
      senderEmail: "system",
      senderName: "\uC2DC\uC2A4\uD15C",
      senderRole: "system",
      content: `\u{1F512} A-BEACON \uC5D0\uC2A4\uD06C\uB85C \u2014 ${amtLabel}\uC774 \uC548\uC804\uD558\uAC8C \uBCF4\uAD00\uB418\uC5C8\uC2B5\uB2C8\uB2E4${remainLabel}. \uC791\uAC00\uAC00 \uC791\uD488\uC744 \uBC1C\uC1A1\uD558\uBA74 \uC54C\uB824\uB4DC\uB9B4\uAC8C\uC694.`,
      sentAt: (/* @__PURE__ */ new Date()).toISOString(),
      messageType: "system"
    });
    saveData();
    res.status(201).json(payment);
  });
  app.put("/api/payments/:paymentId/ship", (req, res) => {
    const { trackingNumber, carrier } = req.body;
    const payment = payments.find((p) => p.id === req.params.paymentId);
    if (!payment) return res.status(404).json({ error: "\uACB0\uC81C \uC815\uBCF4 \uC5C6\uC74C" });
    if (payment.escrowStatus !== "deposit_held") {
      return res.status(400).json({ error: "\uACC4\uC57D\uAE08 \uC785\uAE08 \uD6C4 \uBC1C\uC1A1 \uC2E0\uACE0 \uAC00\uB2A5\uD569\uB2C8\uB2E4" });
    }
    if (!trackingNumber) return res.status(400).json({ error: "\uC6B4\uC1A1\uC7A5 \uBC88\uD638\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694" });
    payment.escrowStatus = "shipped";
    payment.trackingNumber = trackingNumber;
    payment.carrier = carrier || "\uD0DD\uBC30\uC0AC \uBBF8\uC9C0\uC815";
    payment.shippedAt = (/* @__PURE__ */ new Date()).toISOString();
    const finalNote = payment.finalAmount > 0 ? ` \xB7 \uC794\uAE08 ${payment.finalAmount.toLocaleString("ko-KR")}\uC6D0\uC740 \uC218\uB839 \uD655\uC778 \uC2DC \uD568\uAED8 \uACB0\uC81C\uB429\uB2C8\uB2E4` : "";
    chatMessages.push({
      id: `msg_ship_${Date.now()}`,
      inquiryId: payment.inquiryId,
      senderEmail: "system",
      senderName: "\uC2DC\uC2A4\uD15C",
      senderRole: "system",
      content: `\u{1F4E6} \uBC1C\uC1A1 \uC644\uB8CC \u2014 [${payment.carrier}] \uC6B4\uC1A1\uC7A5: ${trackingNumber}${finalNote}. \uC791\uD488\uC744 \uBC1B\uC73C\uC2DC\uBA74 \uC218\uB839 \uD655\uC778 \uBC84\uD2BC\uC744 \uB20C\uB7EC\uC8FC\uC138\uC694.`,
      sentAt: (/* @__PURE__ */ new Date()).toISOString(),
      messageType: "system"
    });
    saveData();
    res.json(payment);
  });
  app.put("/api/payments/:paymentId/confirm", (req, res) => {
    const payment = payments.find((p) => p.id === req.params.paymentId);
    if (!payment) return res.status(404).json({ error: "\uACB0\uC81C \uC815\uBCF4 \uC5C6\uC74C" });
    if (payment.escrowStatus !== "shipped") {
      return res.status(400).json({ error: "\uBC1C\uC1A1 \uC644\uB8CC \uD6C4 \uC218\uB839 \uD655\uC778 \uAC00\uB2A5\uD569\uB2C8\uB2E4" });
    }
    payment.escrowStatus = "released";
    payment.finalPaidAt = payment.finalAmount > 0 ? (/* @__PURE__ */ new Date()).toISOString() : void 0;
    payment.deliveredConfirmedAt = (/* @__PURE__ */ new Date()).toISOString();
    payment.releasedAt = (/* @__PURE__ */ new Date()).toISOString();
    const inq = inquiries.find((i) => i.id === payment.inquiryId);
    if (inq) inq.status = "\uAC70\uB798\uC644\uB8CC";
    const finalNote = payment.finalAmount > 0 ? `\uC794\uAE08 ${payment.finalAmount.toLocaleString("ko-KR")}\uC6D0 \uACB0\uC81C \uC644\uB8CC. ` : "";
    chatMessages.push({
      id: `msg_confirm_${Date.now()}`,
      inquiryId: payment.inquiryId,
      senderEmail: "system",
      senderName: "\uC2DC\uC2A4\uD15C",
      senderRole: "system",
      content: `\u2705 \uC218\uB839 \uD655\uC778 \uC644\uB8CC \u2014 ${finalNote}A-BEACON\uC774 \uC791\uAC00\uC5D0\uAC8C \uCD1D ${payment.totalPrice.toLocaleString("ko-KR")}\uC6D0\uC744 \uC9C0\uAE09\uD588\uC2B5\uB2C8\uB2E4. \uAC70\uB798\uAC00 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`,
      sentAt: (/* @__PURE__ */ new Date()).toISOString(),
      messageType: "system"
    });
    saveData();
    res.json({ payment, inquiry: inq });
  });
  app.get("/api/inquiries", (req, res) => {
    const { artistId } = req.query;
    if (artistId) {
      const filtered = inquiries.filter((inq) => inq.artistId === artistId);
      return res.json(filtered);
    }
    res.json(inquiries);
  });
  app.get("/api/admin/stats", (req, res) => {
    const categoryCounts = {
      Painting: artworks.filter((a) => a.category === "Painting").length,
      Sculpture: artworks.filter((a) => a.category === "Sculpture").length,
      Photography: artworks.filter((a) => a.category === "Photography").length,
      "Media Art": artworks.filter((a) => a.category === "Media Art").length,
      Craft: artworks.filter((a) => a.category === "Craft").length
    };
    res.json({
      totalArtworks: artworks.length,
      totalArtists: artists.length,
      totalInquiries: inquiries.length,
      categoryCounts
    });
  });
  app.post("/api/search", (req, res) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({ error: "\uAC80\uC0C9 \uC9C8\uC758\uAC00 \uC81C\uACF5\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4." });
    }
    const matches = localRuleBasedSearch(prompt);
    res.json({ ...matches, isMocked: true });
  });
  app.post("/api/ai-autotag", (req, res) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "\uC791\uD488 \uC81C\uBAA9\uC774 \uD544\uC694\uD569\uB2C8\uB2E4." });
    }
    const defaultTags = ["\uB3C4\uC608", "\uD68C\uD654", "\uD48D\uACBD", "\uC778\uD14C\uB9AC\uC5B4", "\uD604\uB300\uBBF8\uC220", "\uC778\uAE30\uC791"].slice(0, 4);
    res.json({ tags: defaultTags, isMocked: true });
  });
  const FLASK_URL = process.env.FLASK_URL ?? "http://localhost:5000";
  async function syncArtworksToFlask() {
    try {
      const payload = artworks.map((a) => ({
        ab_id: a.id,
        title: a.title,
        description: a.description,
        imageUrl: a.image
      }));
      const res = await fetch(`${FLASK_URL}/api/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6e4)
        // 최대 60초 (벡터화 시간 고려)
      });
      if (res.ok) {
        const result = await res.json();
        console.log(`[AI Sync] Flask \uB3D9\uAE30\uD654 \uC644\uB8CC \u2014 synced:${result.synced}, skipped:${result.skipped}`);
      } else {
        console.warn("[AI Sync] Flask \uC751\uB2F5 \uC624\uB958:", res.status);
      }
    } catch (e) {
      console.warn("[AI Sync] Flask \uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uBC29 \uC0AC\uC9C4 AI \uAE30\uB2A5\uC774 \uBE44\uD65C\uC131\uD654\uB429\uB2C8\uB2E4.");
    }
  }
  syncArtworksToFlask();
  app.post("/api/gemini/room-preview", async (req, res) => {
    const { roomImageBase64, artworkImageUrl, artworkTitle } = req.body;
    if (!roomImageBase64 || !artworkImageUrl) {
      return res.status(400).json({ error: "roomImageBase64\uC640 artworkImageUrl\uC774 \uD544\uC694\uD569\uB2C8\uB2E4." });
    }
    try {
      const artworkRes = await fetch(artworkImageUrl, { signal: AbortSignal.timeout(15e3) });
      if (!artworkRes.ok) throw new Error("\uC791\uD488 \uC774\uBBF8\uC9C0\uB97C \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
      const artworkBuffer = await artworkRes.arrayBuffer();
      const artworkBase64 = Buffer.from(artworkBuffer).toString("base64");
      const flaskRes = await fetch(`${FLASK_URL}/api/room-preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomImageBase64,
          artworkImageBase64: artworkBase64,
          artworkTitle: artworkTitle || "\uC791\uD488"
        }),
        signal: AbortSignal.timeout(12e4)
      });
      const flaskData = await flaskRes.json();
      if (!flaskRes.ok || !flaskData.imageBase64) {
        console.error("[Room Preview] Flask \uC624\uB958:", flaskData.error);
        return res.status(502).json({ error: flaskData.error || "\uC774\uBBF8\uC9C0 \uC0DD\uC131\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4." });
      }
      res.json({
        previewImageBase64: flaskData.imageBase64,
        mimeType: flaskData.mimeType || "image/jpeg"
      });
    } catch (e) {
      console.error("[Room Preview] \uC624\uB958:", e);
      res.status(503).json({ error: "\uC774\uBBF8\uC9C0 \uC0DD\uC131 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4." });
    }
  });
  app.post("/api/room-match", async (req, res) => {
    const { userText, roomImageBase64 } = req.body;
    if (!userText || !roomImageBase64) {
      return res.status(400).json({ error: "userText\uC640 roomImageBase64\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4." });
    }
    try {
      const flaskRes = await fetch(`${FLASK_URL}/api/recommend-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText, roomImageBase64 }),
        signal: AbortSignal.timeout(6e4)
      });
      if (!flaskRes.ok) {
        const errText = await flaskRes.text();
        console.error("[Room Match] Flask \uC624\uB958:", errText);
        return res.status(502).json({ error: "AI \uCD94\uCC9C \uC11C\uBC84 \uC624\uB958", isMocked: true });
      }
      const flaskData = await flaskRes.json();
      const tags = [];
      for (const abId of flaskData.matchedArtworkIds) {
        const artwork = artworks.find((a) => a.id === abId);
        if (artwork?.tags) {
          for (const t of artwork.tags) {
            if (!tags.includes(t)) tags.push(t);
          }
        }
      }
      res.json({
        tags: tags.slice(0, 6),
        matchedArtworkIds: flaskData.matchedArtworkIds,
        explanations: flaskData.explanations,
        scores: flaskData.scores,
        isMocked: false
      });
    } catch (e) {
      console.error("[Room Match] \uC624\uB958:", e);
      res.status(503).json({ error: "AI \uC11C\uBC84\uC5D0 \uC5F0\uACB0\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", isMocked: true });
    }
  });
  if (process.env.NODE_ENV === "development") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    const indexPath = import_path.default.join(distPath, "index.html");
    const indexHtml = import_fs.default.existsSync(indexPath) ? import_fs.default.readFileSync(indexPath, "utf-8") : null;
    console.log(`[Static] distPath=${distPath} | index.html=${indexHtml ? "found" : "NOT FOUND"}`);
    app.use("/assets", import_express.default.static(import_path.default.join(distPath, "assets")));
    app.get("*", (_req, res) => {
      if (indexHtml) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(indexHtml);
      } else {
        res.status(404).send(`index.html not found at ${indexPath}`);
      }
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[A-BEACON Full-Stack Server] booted successfully and listening on port ${PORT}`);
  });
}
process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled rejection:", reason);
  process.exit(1);
});
startServer().catch((error) => {
  console.error("[FATAL] Failed to start server:", error);
  process.exit(1);
});
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
