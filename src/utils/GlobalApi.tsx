import axios, { AxiosError } from "axios";


const key = 'api';

export interface OrderLine {
    id: number;
    OrderLineID: number;
    OrderID: number;
    StockItemID: number;
    Description: string;
    PackageTypeID: number;
    Quantity: number;
    UnitPrice: number;
}

export interface GroupedOrder {
  groupByKeyValue: number;
  OrdersUnderGroupByKeyValue: OrderLine[];
}


export const authAxios = axios.create({
    baseURL: "https://minizuba-fn.azurewebsites.net",
    headers: {
      "Content-Type": "application/json",
    },
  });
  

export const getOrderLines = async (typeID: number) => {
    try {
      const res = await authAxios.get(`/${key}/orderlines?type_id=${typeID}`);
      return res.data;
    }
    catch (err) {
      const error = err as AxiosError;
      return error.response?.data;
    }
  
  };



  export function groupAndSortArray(array: OrderLine[], groupByKey: keyof OrderLine) {
    const groupedBy: Record<number, OrderLine[]> = {};
  
    array.forEach((item) => {
      const key: any = item[groupByKey];
      if (!groupedBy[key]) {
        groupedBy[key] = [];
      }
      groupedBy[key].push(item);
    });
  
    const sortedArray = Object.values(groupedBy).flatMap((group) =>
      group.sort((a:any, b: any) => a[groupByKey] - b[groupByKey])
    );
  
    return sortedArray;
  }
  
  export function groupBy(array: OrderLine[], groupByKey: keyof OrderLine): GroupedOrder[] {
    const groupedMap = new Map<number, GroupedOrder>();
  
    array.forEach((item) => {
      const key: any = item[groupByKey];
  
      if (groupedMap.has(key)) {
        groupedMap.get(key)?.OrdersUnderGroupByKeyValue.push(item);
      } else {
        const newGroup: GroupedOrder = {
          groupByKeyValue: key,
          OrdersUnderGroupByKeyValue: [item],
        };
        groupedMap.set(key, newGroup);
      }
    });
  
    const groupedItems = Array.from(groupedMap.values());
    return groupedItems;
  }


  export const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'OrderLineID', headerName: 'Order Line Id'},
    { field: 'OrderID', headerName: 'Order ID'},
    { field: 'Description', headerName: 'Description', width: 380},
    { field: 'PackageTypeID', headerName: 'Package ID'},
    { field: 'Quantity', headerName: 'Quantity'},
    { field: 'StockItemID', headerName: 'StockItem ID'},
    { field: 'UnitPrice', headerName: 'Unit Price'},
  ];