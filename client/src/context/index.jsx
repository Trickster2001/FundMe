import React, { createContext, useContext } from "react";

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();
// goerli
// 0xb917c64b91365B146c22F4913C4B8A5582b5cCDc
// sepolia
// 0xb917c64b91365B146c22F4913C4B8A5582b5cCDc
// mumbai
// 0x05cF6880D5a8A098B4Cb687A6dCBc786a39a0759
export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0x6e758d04af1111468AB45Abc4343466a8d2FB044');
  const { mutateAsync: createCampaign } =
    useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, //owner
          form.title, //title
          form.description, //description
          form.target,
          new Date(form.deadline).getTime(), //deadline
          form.image
        ]
      })

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failed", error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  return (
    <StateContext.Provider value={{ address, contract, connect, createCampaign: publishCampaign, getCampaigns, getUserCampaigns, donate, getDonations }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => {
  return useContext(StateContext);
}