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
  OrderId: number;
  OrdersUnderOrderId: OrderLine[];
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