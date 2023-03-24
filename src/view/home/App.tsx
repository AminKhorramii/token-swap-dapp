import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import Modal from "../../components/Modal/Modal";
import "./App.css";
import Selector from "../../components/Selector/Selector";
import Input from "../../components/Input/Input";

export interface ISelectorOption {}

interface IToken {
  address: string;
  decimals: number;
  [key: string]: unknown; // More properties will be added
}

interface IForm {
  sourceToken: IToken | null;
  sourceTokenValue: string;
  targetToken: IToken | null;
  targetTokenValue: string;
}

const METAMASK_METHODS = {
  // Requests permission from the user to access their Ethereum accounts.
  // Once the user approves the request, the method returns an array of the user's Ethereum accounts.
  request_accounts: "eth_requestAccounts",
  // Returns an array of the user's Ethereum accounts without requesting permission.
  // This method is only available if the user has already approved access to their accounts previously.
  // If the user has not approved access, eth_accounts will return an empty array.
  accounts: "eth_accounts"

};

const STRINGS = {
  intro: `
  Introducing our powerful new aggregator,
  built with the capabilities of 0x.org technology.
  Our platform allows you to easily compare and execute trades across multiple decentralized exchanges (DEXs) with just a few clicks.
  With our aggregator, you gain access to a vast array of liquidity sources,
  including the top DEXs such as Uniswap, SushiSwap, and Curve.
  You no longer have to manually search through various exchanges to find the best price for your desired trade.
  Our platform automatically scans multiple exchanges to find the best price for you, ensuring that you get the best deal possible.
  Our aggregator is easy to use, even for beginners. Simply input the details of your trade, and our platform will do the rest.
  You can customize your trades with a variety of options such as limit orders, stop-loss orders, and more.
`
};

function addParamsToUrl(
  baseUrl: string,
  params: { [key: string]: string }
): string {
  let url = new URL(baseUrl);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function isDisabled(value: number, notBeEqualTo: number): boolean {
  console.log("isNotDisabled", value, notBeEqualTo);
  return value && value !== notBeEqualTo ? false : true;
}

function IsWalletInstalled({
  metamaskInstalled,
}: {
  metamaskInstalled: Boolean;
}) {
  const [sourceTokens, setSourceTokens] = useState<Array<unknown>>([]);
  const [form, setForm] = useState<IForm>({
    sourceToken: null,
    sourceTokenValue: "0",
    targetToken: null,
    targetTokenValue: "0",
  });
  const [estimatedGas, setEstimatedGas] = useState<string>("");

  // Fetch the list of the tokens
  useEffect(() => {
    const fetchTheListOfTokens = async () => {
      const response = await fetch(
        "https://tokens.coingecko.com/uniswap/all.json"
      );
      const tokens = await response.json();
      setSourceTokens(tokens.tokens);
    };

    fetchTheListOfTokens();
  }, []);

  // In case source token, target token and amount of source token
  // Got selected fetch the price of the token
  useEffect(() => {
    if (
      form.sourceToken &&
      form.targetToken &&
      Number(form.sourceTokenValue) !== 0
    ) {
      getPrice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.sourceToken, form.targetToken, form.sourceTokenValue]);

  async function getPrice() {
    try {
      const params: {
        sellToken: string;
        buyToken: string;
        sellAmount: string;
      } = {
        sellToken: form?.sourceToken?.address ?? "",
        buyToken: form?.targetToken?.address ?? "",
        sellAmount: String(
          Number(form.sourceTokenValue) *
            10 ** (form.sourceToken?.decimals ?? 0)
        ),
      };

      // Fetch the swap price.
      const priceResponse = await fetch(
        addParamsToUrl(`https://api.0x.org/swap/v1/price`, params)
      );
      const swapPriceJSON = await priceResponse.json();
      console.log("Price: ", swapPriceJSON);
      setForm({
        ...form,
        targetTokenValue: String(
          Number(swapPriceJSON.buyAmount) /
            10 ** (form?.targetToken?.decimals ?? 0)
        ),
      });
      setEstimatedGas(swapPriceJSON.estimatedGas);
    } catch (error) {
      console.error("something wrong with price api call!");
      throw new Error("something went wrong...");
    }
  }

  function onMetaMaskInstallClicked() {
    let a = document.createElement("a");
    a.target = "_blank";
    a.href = "https://metamask.io/download/";
    a.click();
  }

  const onSourceTokenOptionClicked = ({
    target,
  }: ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      sourceToken: JSON.parse(target.value),
    });
  };

  const onTargetTokenOptionClicked = ({
    target,
  }: ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      targetToken: JSON.parse(target.value),
    });
  };

  function onSourceInputChanged({ target }: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      sourceTokenValue: target.value,
    });
  }

  function onTargetInputChanged({ target }: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      targetTokenValue: target.value,
    });
  }

  async function getQuote(address : string) {
    try {
      const params: {
        sellToken: string;
        buyToken: string;
        sellAmount: string;
        takerAddress: string;
      } = {
        sellToken: form?.sourceToken?.address ?? "",
        buyToken: form?.targetToken?.address ?? "",
        sellAmount: String(
          Number(form.sourceTokenValue) *
            10 ** (form.sourceToken?.decimals ?? 0)
        ),
        takerAddress: address
      };

      // Fetch the swap price.
      const priceResponse = await fetch(
        addParamsToUrl(`https://api.0x.org/quote/v1/price`, params)
      );
      const swapQuoteJSON = await priceResponse.json();
      return swapQuoteJSON;
    } catch (error) {
      console.error("something wrong with price api call!");
      throw new Error("something went wrong...");
    }
  }

  async function onSwapClicked() {
    getQuote('')
  }

  if (!metamaskInstalled)
    return (
      <button className='btn btn-secondary' onClick={onMetaMaskInstallClicked}>
        Install Metamask
      </button>
    );

  return (
    <>
      <label htmlFor='modal-convertor' className='btn'>
        Start Converting
      </label>
      <input type='checkbox' id='modal-convertor' className='modal-toggle' />
      <Modal>
        <div className='flex flex-col w-full border-opacity-50'>
          <div className='flex w-full justify-evenly'>
            <Selector
              className='grid h-20 flex-grow card bg-base-300 rounded-box place-items-center'
              options={sourceTokens}
              baseText='Select the source token'
              onOptionClicked={onSourceTokenOptionClicked}
            />
            <div className='divider divider-horizontal'> With Amount </div>
            <Input
              inputValue={form.sourceTokenValue}
              onInputChanged={onSourceInputChanged}
              placeholder='Amount'
            />
          </div>
          <div className='divider'>BE CONVERTED TO</div>
          <div className='flex w-full justify-evenly'>
            <Selector
              className='grid h-20 flex-grow card bg-base-300 rounded-box place-items-center'
              options={sourceTokens}
              baseText='Select the target token'
              onOptionClicked={onTargetTokenOptionClicked}
            />
            <div className='divider divider-horizontal'> With Amount </div>
            <Input
              disabled={isDisabled(Number(form.sourceTokenValue), 0)}
              inputValue={form.targetTokenValue}
              onInputChanged={onTargetInputChanged}
              placeholder='Amount'
              readonly
            />
          </div>
        </div>
        <div>Estimated Gas will be: {estimatedGas}</div>
        <button onClick={onSwapClicked} disabled={false} className="btn btn-primary">Swap</button>
      </Modal>
    </>
  );
}

function App(): JSX.Element {
  const [readyToBeShown, setReadyToBeShown] = useState<Boolean>(false);
  const [metamaskInstalled, setMetaMaskInstalled] = useState<Boolean>(false);

  // Check if the wallet exits
  useEffect(() => {
    const getTheEthAccounts = async () => {
      try {
        const { ethereum } = window;
        if (typeof ethereum !== "undefined") {
          await ethereum.request({ method: METAMASK_METHODS.request_accounts });
          setMetaMaskInstalled(true);
        } else {
          setMetaMaskInstalled(false);
        }
      } finally {
        setReadyToBeShown(true);
      }
    };

    getTheEthAccounts();
  }, []);

  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <div className='mockup-window border border-base-300'>
            <div className='flex flex-col justify-center px-4 py-16 border-t border-base-300'>
              <h1 className='text-5xl font-bold'>Hello there</h1>
              <p className='py-6'>
                {STRINGS.intro}
              </p>
              {readyToBeShown && (
                <IsWalletInstalled metamaskInstalled={metamaskInstalled} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
