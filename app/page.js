"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import axios from "axios";

import { Utils } from "alchemy-sdk";

import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import InfoDisplay from "@/components/InfoDisplay";

export default function Home() {
  const [blockDetails, setBlockDetails] = useState();
  const [stats, setStats] = useState();

  useEffect(() => {
    async function getLatestBlocks() {
      try {
        const response = await axios.get("/api/latest-blocks");
        setBlockDetails(response.data);
      } catch (error) {
        console.log("error", error);
      }
    }
    async function getLatestStats() {
      try {
        const response = await axios.get("/api/latest-stats");
        console.log("response", response);
        setStats(response.data);
      } catch (error) {
        console.log("error", error);
      }
    }

    getLatestBlocks();
    getLatestStats();
  }, []);

  if (!blockDetails || !stats) return <LoadingSpinner />;

  const { nodes, prices, supply } = stats;

  const supplyStats = [
    {
      key: "Eth Supply :",
      value: Number(Utils.formatEther(supply.EthSupply)).toFixed(2) + " ETH",
    },
    {
      key: "Stake Rewards:",
      value: Number(Utils.formatEther(supply.Eth2Staking)).toFixed(2) + " ETH",
    },
  ];

  const priceStats = [
    {
      key: "ETH/USD :",
      value: "$" + prices.ethusd,
    },
    {
      key: "ETH/BTC :",
      value: prices.ethbtc,
    },
  ];

  const nodeStats = [{ key: "Total Nodes :", value: nodes.TotalNodeCount }];

  return (
    <main>
      <section style={{ backgroundColor: "#1a2231" }} className="h-52 md:h-72">
        <div className="flex flex-col justify-center h-full px-5 lg:px-10">
          <div className="flex items-center">
            <div className="w-full lg:basis-1/2 font-gothic">
              <h1 className="mb-3 text-2xl text-white font-gothic">
                Ethereum Mainnet Explorer
              </h1>
              <div>
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="m-5 lg:m-10">
        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
          <div>
            <h3 className="font-gothic text-3xl mb-3">Chain Stats</h3>
            <InfoDisplay items={supplyStats} />
          </div>
          <div>
            <h3 className="font-gothic text-3xl mb-3">Price Stats</h3>
            <InfoDisplay items={priceStats} />
          </div>
          <div>
            <h3 className="font-gothic text-3xl mb-3">Node Stats</h3>
            <InfoDisplay items={nodeStats} />
          </div>
        </div>
      </section>

      <section className="m-5 lg:m-10">
        <h3 className="font-gothic text-3xl mb-3">Latest Blocks</h3>
        <div className="border border-neutral-300 shadow-md rounded-lg bg-white">
          <div className="px-5 pb-2 pt-1 overflow-x-auto">
            <table className="min-w-full font-gothic">
              <thead className="text-2xl">
                <tr className="border-b border-black whitespace-nowrap">
                  <th className="text-start px-2 py-3">Number</th>
                  <th className="text-end py-3">Transactions</th>
                  <th className="text-end py-3">Miner</th>
                  <th className="text-end py-3">Base Fee Per Gas</th>
                  <th className="text-end py-3">Gas Used</th>
                </tr>
              </thead>
              <tbody className="text-2xl">
                {blockDetails.map((block, index) => {
                  const {
                    number,
                    transactions,
                    miner,
                    baseFeePerGas,
                    gasUsed,
                  } = block;

                  const totalTransactions = transactions.length;

                  const blockBaseFeePerGas =
                    (parseInt(baseFeePerGas.hex) / 1e9).toFixed(2) + " Gwei";

                  const blockGasUsed =
                    (parseInt(gasUsed.hex) / 300000).toFixed(2) + "%";

                  return (
                    <tr key={number}>
                      <td
                        className={`py-2 text-end px-2 ${
                          index === blockDetails.length - 1
                            ? ""
                            : "border-b border-grey-300"
                        }`}
                      >
                        <Link
                          href={`/block/${number}`}
                          className="text-blue-500 flex items-center"
                        >
                          {number}
                        </Link>
                      </td>
                      <td
                        className={`text-end px-2 ${
                          index === blockDetails.length - 1
                            ? ""
                            : "border-b border-grey-300"
                        }`}
                      >
                        <Link
                          href={`/block/${number}?tab=transactions`}
                          className="text-blue-500"
                        >
                          {totalTransactions}
                        </Link>
                      </td>
                      <td
                        className={`text-end px-2 ${
                          index === blockDetails.length - 1
                            ? ""
                            : "border-b border-grey-300"
                        }`}
                      >
                        <Link
                          href={`/account/${miner}`}
                          className="text-blue-500"
                        >
                          {miner.slice(0, 4) + "..." + miner.slice(-4)}
                        </Link>
                      </td>
                      <td
                        className={`text-end px-2 ${
                          index === blockDetails.length - 1
                            ? ""
                            : "border-b border-grey-300"
                        }`}
                      >
                        {blockBaseFeePerGas}
                      </td>
                      <td
                        className={`text-end px-2 ${
                          index === blockDetails.length - 1
                            ? ""
                            : "border-b border-grey-300"
                        }`}
                      >
                        {blockGasUsed}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
