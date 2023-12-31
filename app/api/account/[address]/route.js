import alchemy from "../../alchemy.js";
import axios from "axios";

export async function GET(request, { params }) {
  try {
    let { address } = params;

    // if params end in ".eth" perform ens lookup
    if (address.endsWith(".eth")) {
      address = await alchemy.core.resolveName(address);
    }

    const ETHERSCAN_BASE_URL = "https://api.etherscan.io/api";

    const requests = [
      alchemy.core.getBalance(address),
      alchemy.core.getTokensForOwner(address),
      axios.get(ETHERSCAN_BASE_URL, {
        params: {
          module: "account",
          action: "txlist",
          address: address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 20,
          sort: "desc",
          apikey: process.env.ETHERSCAN_API_KEY,
        },
      }),
      axios.get(ETHERSCAN_BASE_URL, {
        params: {
          module: "stats",
          action: "ethprice",
          apikey: process.env.ETHERSCAN_API_KEY,
        },
      }),
    ];

    const [balance, tokens, txResponse, priceResponse] = await Promise.all(
      requests
    );

    const transactions = txResponse.data.result;
    const price = priceResponse.data.result;

    return new Response(
      JSON.stringify({
        balance,
        tokens,
        transactions,
        price,
      })
    );
  } catch (err) {
    console.error("err", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
