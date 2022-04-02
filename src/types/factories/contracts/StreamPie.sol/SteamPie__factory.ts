/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  SteamPie,
  SteamPieInterface,
} from "../../../contracts/StreamPie.sol/SteamPie";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
      {
        internalType: "contract ISablier",
        name: "sablier_",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "forkStreamIndex",
        type: "uint256",
      },
    ],
    name: "cancelForkStream",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "cancelStreamPie",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deposit",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stopTime",
        type: "uint256",
      },
    ],
    name: "createStreamPie",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "forks",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "newRecipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokensToBurn",
        type: "uint256",
      },
    ],
    name: "rageStream",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "sablier",
    outputs: [
      {
        internalType: "contract ISablier",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "streamPieId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "withdrawTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620018fa380380620018fa833981810160405260408110156200003757600080fd5b508051602090910151600580546001600160a01b038085166001600160a01b03199283161790925560038054928416929091169190911790556200008833620f42406001600160e01b036200009016565b5050620001f3565b6001600160a01b038216620000ec576040805162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b62000108816002546200019160201b620012a11790919060201c565b6002556001600160a01b038216600090815260208181526040909120546200013b918390620012a162000191821b17901c565b6001600160a01b0383166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b600082820183811015620001ec576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b6116f780620002036000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80638da5cb5b116100a2578063b44f185811610071578063b44f1858146102dc578063c96b72e41461031c578063dd62ed3e14610324578063eee7a84014610352578063fc0c546a1461036f57610116565b80638da5cb5b146102745780639d5333ac1461027c578063a457c2d714610284578063a9059cbb146102b057610116565b806339509351116100e957806339509351146101d9578063482879aa146102055780634ba3a1261461022957806370a08231146102465780638d8f2adb1461026c57610116565b80630879ede61461011b578063095ea7b31461014957806318160ddd1461018957806323b872dd146101a3575b600080fd5b6101476004803603604081101561013157600080fd5b506001600160a01b038135169060200135610377565b005b6101756004803603604081101561015f57600080fd5b506001600160a01b03813516906020013561095b565b604080519115158252519081900360200190f35b610191610972565b60408051918252519081900360200190f35b610175600480360360608110156101b957600080fd5b506001600160a01b03813581169160208101359091169060400135610978565b610175600480360360408110156101ef57600080fd5b506001600160a01b0381351690602001356109cf565b61020d610a0b565b604080516001600160a01b039092168252519081900360200190f35b6101916004803603602081101561023f57600080fd5b5035610a1a565b6101916004803603602081101561025c57600080fd5b50356001600160a01b0316610a38565b610147610a53565b61020d610af3565b610147610b02565b6101756004803603604081101561029a57600080fd5b506001600160a01b038135169060200135610bd3565b610175600480360360408110156102c657600080fd5b506001600160a01b038135169060200135610c0f565b610147600480360360a08110156102f257600080fd5b506001600160a01b0381358116916020810135916040820135169060608101359060800135610c1c565b610191610dae565b6101916004803603604081101561033a57600080fd5b506001600160a01b0381358116916020013516610db4565b6101476004803603602081101561036857600080fd5b5035610ddf565b61020d610ed8565b8061038133610a38565b10156103d4576040805162461bcd60e51b815260206004820152601960248201527f6e6f7420656e6f75676820746f6b656e7320746f206275726e00000000000000604482015290519081900360640190fd5b604080516323b872dd60e01b815233600482015230602482018190526044820184905291516323b872dd916064808201926020929091908290030181600087803b15801561042157600080fd5b505af1158015610435573d6000803e3d6000fd5b505050506040513d602081101561044b57600080fd5b5050600354600480546040805163894e9a0d60e01b81529283019190915251600092839283926001600160a01b039092169163894e9a0d9160248082019261010092909190829003018186803b1580156104a457600080fd5b505afa1580156104b8573d6000803e3d6000fd5b505050506040513d6101008110156104cf57600080fd5b50602080820151608083015160a0909301516003546004805460408051636db9241b60e01b815292830191909152519398509496509094506001600160a01b031692636db9241b9260248083019391928290030181600087803b15801561053557600080fd5b505af1158015610549573d6000803e3d6000fd5b505050506040513d602081101561055f57600080fd5b5050600654604080516370a0823160e01b815230600482015290516000926001600160a01b0316916370a08231916024808301926020929190829003018186803b1580156105ac57600080fd5b505afa1580156105c0573d6000803e3d6000fd5b505050506040513d60208110156105d657600080fd5b50516006546003546040805163095ea7b360e01b81526001600160a01b03928316600482015260248101859052905193945091169163095ea7b3916044808201926020929091908290030181600087803b15801561063357600080fd5b505af1158015610647573d6000803e3d6000fd5b505050506040513d602081101561065d57600080fd5b5060009050610672838563ffffffff610ee716565b905060006106fa306001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b1580156106b257600080fd5b505afa1580156106c6573d6000803e3d6000fd5b505050506040513d60208110156106dc57600080fd5b50516106ee898663ffffffff610f4416565b9063ffffffff610fa416565b9050600061071e610711838563ffffffff61100e16565b839063ffffffff610ee716565b90506000610732858363ffffffff610ee716565b90506000610749610711838763ffffffff61100e16565b90506000600360009054906101000a90046001600160a01b03166001600160a01b031663cc1b4bf68d86600660009054906101000a90046001600160a01b03168d8e6040518663ffffffff1660e01b815260040180866001600160a01b03166001600160a01b03168152602001858152602001846001600160a01b03166001600160a01b0316815260200183815260200182815260200195505050505050602060405180830381600087803b15801561080157600080fd5b505af1158015610815573d6000803e3d6000fd5b505050506040513d602081101561082b57600080fd5b810190808051906020019092919050505090506007819080600181540180825580915050906001820390600052602060002001600090919290919091505550600360009054906101000a90046001600160a01b03166001600160a01b031663cc1b4bf68b84600660009054906101000a90046001600160a01b03168d8d6040518663ffffffff1660e01b815260040180866001600160a01b03166001600160a01b03168152602001858152602001846001600160a01b03166001600160a01b0316815260200183815260200182815260200195505050505050602060405180830381600087803b15801561091e57600080fd5b505af1158015610932573d6000803e3d6000fd5b505050506040513d602081101561094857600080fd5b5051600455505050505050505050505050565b6000610968338484611073565b5060015b92915050565b60025490565b600061098584848461115f565b6001600160a01b0384166000908152600160209081526040808320338085529252909120546109c59186916109c0908663ffffffff610ee716565b611073565b5060019392505050565b3360008181526001602090815260408083206001600160a01b038716845290915281205490916109689185906109c0908663ffffffff6112a116565b6003546001600160a01b031681565b60078181548110610a2757fe5b600091825260209091200154905081565b6001600160a01b031660009081526020819052604090205490565b600654604080516370a0823160e01b815230600482015290516000926001600160a01b0316916370a08231916024808301926020929190829003018186803b158015610a9e57600080fd5b505afa158015610ab2573d6000803e3d6000fd5b505050506040513d6020811015610ac857600080fd5b5051600554600654919250610af0916001600160a01b0390811691168363ffffffff6112fb16565b50565b6005546001600160a01b031681565b6005546001600160a01b03163314610b4b5760405162461bcd60e51b815260040180806020018281038252602a81526020018061166f602a913960400191505060405180910390fd5b6003546004805460408051636db9241b60e01b815292830191909152516001600160a01b0390921691636db9241b916024808201926020929091908290030181600087803b158015610b9c57600080fd5b505af1158015610bb0573d6000803e3d6000fd5b505050506040513d6020811015610bc657600080fd5b50610bd19050610a53565b565b3360008181526001602090815260408083206001600160a01b038716845290915281205490916109689185906109c0908663ffffffff610ee716565b600061096833848461115f565b60045415610c5b5760405162461bcd60e51b81526004018080602001828103825260228152602001806115e36022913960400191505060405180910390fd5b600680546001600160a01b0319166001600160a01b03858116918217909255600554610c8992163087611352565b6003546040805163095ea7b360e01b81526001600160a01b039283166004820152600019602482015290519185169163095ea7b3916044808201926020929091908290030181600087803b158015610ce057600080fd5b505af1158015610cf4573d6000803e3d6000fd5b505050506040513d6020811015610d0a57600080fd5b50506003546040805163660da5fb60e11b81526001600160a01b03888116600483015260248201889052868116604483015260648201869052608482018590529151919092169163cc1b4bf69160a48083019260209291908290030181600087803b158015610d7857600080fd5b505af1158015610d8c573d6000803e3d6000fd5b505050506040513d6020811015610da257600080fd5b50516004555050505050565b60045481565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6005546001600160a01b03163314610e285760405162461bcd60e51b815260040180806020018281038252602d8152602001806115b6602d913960400191505060405180910390fd5b600060078281548110610e3757fe5b90600052602060002001549050600360009054906101000a90046001600160a01b03166001600160a01b0316636db9241b826040518263ffffffff1660e01b815260040180828152602001915050602060405180830381600087803b158015610e9f57600080fd5b505af1158015610eb3573d6000803e3d6000fd5b505050506040513d6020811015610ec957600080fd5b50610ed49050610a53565b5050565b6006546001600160a01b031681565b600082821115610f3e576040805162461bcd60e51b815260206004820152601e60248201527f536166654d6174683a207375627472616374696f6e206f766572666c6f770000604482015290519081900360640190fd5b50900390565b600082610f535750600061096c565b82820282848281610f6057fe5b0414610f9d5760405162461bcd60e51b81526004018080602001828103825260218152602001806116056021913960400191505060405180910390fd5b9392505050565b6000808211610ffa576040805162461bcd60e51b815260206004820152601a60248201527f536166654d6174683a206469766973696f6e206279207a65726f000000000000604482015290519081900360640190fd5b600082848161100557fe5b04949350505050565b600081611062576040805162461bcd60e51b815260206004820152601860248201527f536166654d6174683a206d6f64756c6f206279207a65726f0000000000000000604482015290519081900360640190fd5b81838161106b57fe5b069392505050565b6001600160a01b0383166110b85760405162461bcd60e51b815260040180806020018281038252602481526020018061164b6024913960400191505060405180910390fd5b6001600160a01b0382166110fd5760405162461bcd60e51b81526004018080602001828103825260228152602001806115946022913960400191505060405180910390fd5b6001600160a01b03808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b0383166111a45760405162461bcd60e51b81526004018080602001828103825260258152602001806116266025913960400191505060405180910390fd5b6001600160a01b0382166111e95760405162461bcd60e51b81526004018080602001828103825260238152602001806115716023913960400191505060405180910390fd5b6001600160a01b038316600090815260208190526040902054611212908263ffffffff610ee716565b6001600160a01b038085166000908152602081905260408082209390935590841681522054611247908263ffffffff6112a116565b6001600160a01b038084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b600082820183811015610f9d576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b17905261134d9084906113b2565b505050565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b1790526113ac9085906113b2565b50505050565b6113c4826001600160a01b031661156a565b611415576040805162461bcd60e51b815260206004820152601f60248201527f5361666545524332303a2063616c6c20746f206e6f6e2d636f6e747261637400604482015290519081900360640190fd5b60006060836001600160a01b0316836040518082805190602001908083835b602083106114535780518252601f199092019160209182019101611434565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146114b5576040519150601f19603f3d011682016040523d82523d6000602084013e6114ba565b606091505b509150915081611511576040805162461bcd60e51b815260206004820181905260248201527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564604482015290519081900360640190fd5b8051156113ac5780806020019051602081101561152d57600080fd5b50516113ac5760405162461bcd60e51b815260040180806020018281038252602a815260200180611699602a913960400191505060405180910390fd5b3b15159056fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f20616464726573736f6e6c79206f776e657220697320616c6c6f77656420746f2063616e63656c206120666f726b2073747265616d6f6e6c79206f6e652073747265616d207069652063616e2062652063726561746564536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f7745524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f20616464726573736f6e6c79206f776e657220697320616c6c6f77656420746f2063616e63656c2073747265616d207069655361666545524332303a204552433230206f7065726174696f6e20646964206e6f742073756363656564a265627a7a72315820dba3ac3907b23c2e7d85a457bad2f9fdcdbe8a6b33301da28be234805bd7523064736f6c63430005110032";

type SteamPieConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SteamPieConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SteamPie__factory extends ContractFactory {
  constructor(...args: SteamPieConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    owner_: string,
    sablier_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SteamPie> {
    return super.deploy(owner_, sablier_, overrides || {}) as Promise<SteamPie>;
  }
  override getDeployTransaction(
    owner_: string,
    sablier_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(owner_, sablier_, overrides || {});
  }
  override attach(address: string): SteamPie {
    return super.attach(address) as SteamPie;
  }
  override connect(signer: Signer): SteamPie__factory {
    return super.connect(signer) as SteamPie__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SteamPieInterface {
    return new utils.Interface(_abi) as SteamPieInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SteamPie {
    return new Contract(address, _abi, signerOrProvider) as SteamPie;
  }
}
