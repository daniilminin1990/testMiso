// // import { FinderContainer } from "@components/hoc/finderContainer/finderContainer";
// import { render, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { Input } from "@v-uik/base";
// import "@testing-library/jest-dom";

// // SETTINGS
// const notfoundMessage = "not found";
// const loaderMessage = "loading...";
// // MOCKS
// const generalMockSub = "mock";
// const fooResult = { content: "foo", num: 5 };
// const barResult = { content: "bar", num: 5 };

// const mockHints = [] as string[];

// for (let i = 0; i < fooResult.num; i++) {
//   mockHints.push(`${generalMockSub}_${fooResult.content}`);
// }

// for (let i = 0; i < barResult.num; i++) {
//   mockHints.push(`${generalMockSub}_${barResult.content}`);
// }

// // REQUESTS MOCK
// const handleGetterRequest = jest.fn((resp: string) => {
//   return Promise.resolve(
//     mockHints
//       .filter((hint) => hint.includes(resp))
//       .map((hint, i) => ({ id: i.toString(), value: hint }))
//   );
// });

// const handleInitialRequest = jest.fn(() => {
//   return Promise.resolve(
//     mockHints.map((hint, i) => ({ id: i.toString(), value: hint }))
//   );
// });

// // COMPONENT
// const getComponent = () => {
//   return render(
//     <FinderContainer
//       messages={{
//         notfound: notfoundMessage,
//         loading: loaderMessage,
//       }}
//       onSelectItem={() => {}}
//       dataGetter={handleGetterRequest}
//       initialGetter={handleInitialRequest}
//     >
//       <Input />
//     </FinderContainer>
//   );
// };

// beforeEach(() => {
//   handleInitialRequest.mockClear();
//   handleGetterRequest.mockClear();
// });

// // TESTS
// describe("Header. HOC Finder", () => {
//   it("should call handleSearchRequest on select", async () => {
//     const container = getComponent();
//     const input = container.getByRole("textbox");
//     // CHECK IF INPUT IS IN DOM
//     expect(input).toBeInTheDocument();
//     // CLICK
//     // TODO EDIT MININ add await for asynchronous behavior
//     await userEvent.click(input);
//     // THE LIST HAS BEEN SHOWN
//     const listSearchingResponse = await container.findAllByText(
//       new RegExp(generalMockSub)
//     );
//     await waitFor(() => {
//       expect(handleInitialRequest).toBeCalledTimes(1);
//       expect(listSearchingResponse).toHaveLength(mockHints.length);
//     });
//   });

//   it("Output verification in case of successfully executed request", async () => {
//     //GET DATA FROM...
//     const container = getComponent();
//     const input = container.getByRole("textbox");
//     // CHECK IF INPUT IS IN DOM
//     expect(input).toBeInTheDocument();
//     // SET NEW VALUE
//     await userEvent.type(input, fooResult.content);
//     // CHECK IF INPUT VALUE CHANGED AND REQUEST HAS BEEN FOUND
//     const listSearchingResponse = await container.findAllByText(
//       new RegExp(generalMockSub)
//     );
//     await waitFor(() => {
//       expect(listSearchingResponse).toHaveLength(fooResult.num);
//     });
//   });

//   it("Checking the response to a query for which nothing could be found", async () => {
//     // SHUFFLE FUNCTION
//     function shuffleString(str: string) {
//       const strArray = str.split("");
//       for (let i = strArray.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [strArray[i], strArray[j]] = [strArray[j], strArray[i]];
//       }
//       return strArray.join("");
//     }

//     //GET DATA FROM...
//     const container = getComponent();
//     const input = container.getByRole("textbox");
//     // CHECK IF INPUT IS IN DOM
//     expect(input).toBeInTheDocument();
//     // SET NEW VALUE
//     await userEvent.type(input, shuffleString(generalMockSub));
//     // CHECK IF INPUT VALUE CHANGED AND REQUEST HAS BEEN FOUND
//     const listSearchingResponse = await container.findAllByText(
//       new RegExp(notfoundMessage)
//     );
//     await waitFor(() => {
//       // SHOULD TO HAVE ONLY ONE ITEM. "NOT FOUND"
//       expect(listSearchingResponse.length).toBe(1);
//     });
//   });

//   it("Enter the text and Check that the download message appears after entering the character", async () => {
//     const container = getComponent();
//     const input = container.getByRole("textbox");

//     expect(input).toBeInTheDocument();

//     const loaderRegex = new RegExp(loaderMessage);

//     for (let i = 0; i < barResult.content.length; i++) {
//       const char = barResult.content.charAt(i);
//       await userEvent.type(input, char);
//       const listSearchingResponse = container.queryAllByText(loaderRegex);
//       expect(listSearchingResponse.length).toBeGreaterThan(0);
//     }
//     await waitFor(() => {
//       const finalListSearchingResponse = container.queryAllByText(loaderRegex);
//       // TODO EDIT MININ after loading is finished the message should be empty КОроче, после заверщения загрузки, сообщение должно исчезнуть. Должно быть не 1, а 0
//       // expect(finalListSearchingResponse.length).toBe(1);
//       expect(finalListSearchingResponse.length).toBe(0);
//     });
//   });
// });

export {};
