import { useQuery } from "react-query";
import axios from 'axios';
import { getOrderLines } from "./GlobalApi";

const getRowsWithID = (rows:any) => {
    let id = 1;
    let CompleteRowListArray = []

    for(let row of rows){
      const rowWithID = {
        id: id,
        ...row
      }
      id++
      CompleteRowListArray.push(rowWithID)
    }

    return CompleteRowListArray
  }

  const fetchOrderLines = async (packageIdOption: any) => {

    try {
        if(packageIdOption === undefined){
            const promises = [];
            for (let i = 1; i <= 14; i++) {
                promises.push(getOrderLines(i));
            }

            const responses = await Promise.all(promises);
            const mergedData = responses.reduce((acc, data) => acc.concat(data), []);
            const idResponse = getRowsWithID(mergedData);

            const sortByOrderLineID = [...idResponse].sort((a,b)=> a.OrderLineID - b.OrderLineID);

            return sortByOrderLineID;
        }
        else {
            const specificPackageResponse = await getOrderLines(packageIdOption)
            const idResponse = getRowsWithID(specificPackageResponse);

            const sortByOrderLineID = [...idResponse].sort((a,b)=> a.OrderLineID - b.OrderLineID);

            return sortByOrderLineID;
        }
    } catch (error) {
      console.error('Error fetching order lines:', error);
    } finally {
    }
  };

export const useOrdersHook = (onSuccess:any, onError:any, packageIdOption: any) => {
  return useQuery(
        ['catch-Orders', packageIdOption],
        () => fetchOrderLines(packageIdOption),
        {
            cacheTime:600000, // It basically describes how long data should be kept in the cache before it can be garbage collected.
            // staleTime: 30000, // you're guaranteed to not get another network request for prescribed minutes after the first successful one.
            staleTime: 60000,
            refetchOnMount: true, // This makes API call whenever you visit the page
            // refetchOnWindowFocus: true, // This is already set to true
            // We dont need refetchInterval
            // We dont need refetchINterval in background also
            onSuccess,
            onError,
        },
  
  
  )
  
}