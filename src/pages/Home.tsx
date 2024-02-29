import React, {  useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from 'styled-components';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { GroupedOrder, OrderLine } from '../utils/GlobalApi';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from "@mui/material/Skeleton";
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { styled as Styled } from '@mui/material/styles';
import { useOrdersHook } from '../utils/useOrdersHook';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { usePackageContext } from '../utils/ContextProvider';


const RecordsPerPage = 5; 


interface packageProps {
  packageType: string;
  packageId: number;
}

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}


const Accordion = Styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = Styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(255, 255, 255, .05)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = Styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(255, 255, 255, .05)',
}));


export const HeaderStyle = styled.div`
font-family: "Roboto-Regular";
font-weight: 700;
color: #212121;
font-size: 40px;
line-height: 46.88px;
`

const ErrorMessage = styled.div`
    color: white;
    display: flex;
    font-size: xxx-large;
    margin: 100px;
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
    align-items: center;
    justify-content: center;
`

const columns = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'OrderLineID', headerName: 'Order Line Id'},
  { field: 'OrderID', headerName: 'Order ID'},
  { field: 'Description', headerName: 'Description', width: 380},
  { field: 'PackageTypeID', headerName: 'Package ID'},
  { field: 'Quantity', headerName: 'Quantity'},
  { field: 'StockItemID', headerName: 'StockItem ID'},
  { field: 'UnitPrice', headerName: 'Unit Price'},
];

const defaultPackages = [
  { packageType: '1', packageId: 1 },
  { packageType: '2', packageId: 2 },
  { packageType: '3', packageId: 3 },
  { packageType: '4', packageId: 4 },
  { packageType: '5', packageId: 5 },
  { packageType: '6', packageId: 6 },
  { packageType: '7', packageId: 7 },
  { packageType: '8', packageId: 8 },
  { packageType: '9', packageId: 9 },
  { packageType: '10', packageId: 10 },
  { packageType: '11', packageId: 11 },
  { packageType: '12', packageId: 12 },
  { packageType: '13', packageId: 13 },
  { packageType: '14', packageId: 14 },
];

const Home = () => {

    const [groupByInitiated, setGroupByInitiated] = useState<boolean>(false);

    

    const [orderLineGroupedData, setOrderLineGroupedData] = useState<GroupedOrder[]>();
    
    const {packageIDValue, setPackageData} = usePackageContext();

    const [currentPage, setCurrentPage] = useState<number>(1);
  
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const [open, setOpen] = React.useState(false);

    const [packageIdOption, setPackageIdOption] = useState<number>();
    const [options, setOptions] = React.useState<readonly packageProps[]>([]);
    const filterLoad = open && options.length === 0;
  
    React.useEffect(() => {
      let active = true;
  
      if (!filterLoad) {
        return undefined;
      }
  
      (async () => {
        await sleep(1e3); // For demo purposes.
  
        // if (active && data !== undefined && data.length > 0) {
          
            
        //       extractUniquePackageTypes(data)
          
        // }
        if (active) {
          setOptions([...defaultPackages]);
         }
      })();
  
      return () => {
        active = false;
      };
    }, [filterLoad]);
  
    React.useEffect(() => {
      if (!open) {
        setOptions([]);
      }
    }, [open]);
    
    const onSuccess = ()=> {
      console.warn("Successfully fetched the data")
    }
    const onError =  ()=> {
      console.warn(error)
    }

    useEffect(()=> {
      if(data !== undefined && groupByInitiated === true){
        const resultArray = groupAndSortArray(data);
        const result = groupByOrderId(resultArray);
        setOrderLineGroupedData(result);
      }
    },[groupByInitiated])

    
    const extractUniquePackageTypes = (dataArray: OrderLine[]) => {
      const uniquePackageTypesSet = new Set<number>();
      dataArray.forEach((item) => {
        uniquePackageTypesSet.add(item.PackageTypeID);
      });
      const uniquePackageTypesArray = Array.from(uniquePackageTypesSet).map((packageTypeId) => ({
        packageType: `${packageTypeId}`,
        packageId: packageTypeId as number,
      }));
      setOptions([...uniquePackageTypesArray]);
    };


    const updatedColumns = React.useMemo(
      () =>
        columns.map((col) =>
          col.field === 'PackageTypeID' ? { ...col, filterable: false } : col,
        ),
      [columns],
    );
    
    const { isLoading, isError, data, error } = useOrdersHook(onSuccess,onError,packageIdOption)

    if(isError){
        return <ErrorMessage>{JSON.stringify(error)}</ErrorMessage>
    }

    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

    

      const startIndex = (currentPage - 1) * RecordsPerPage;
      const totalPages =  orderLineGroupedData !== undefined && orderLineGroupedData.length !== 0 ? Math.ceil( orderLineGroupedData.length / RecordsPerPage) : 0;
      const endIndex = startIndex + RecordsPerPage;
      const currentRecords = orderLineGroupedData?.slice(startIndex, endIndex);
      
      const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
      };
  


      const LoadingSkeleton = () => (
        <Box
          sx={{
            height: "max-content"
          }}
        >
          {[...Array(10)].map((data, i) => (
            <Skeleton key={i} variant="rectangular" sx={{ my: 4, mx: 1 }} />
          ))}
        </Box>
      );
    
    function groupAndSortArray(array: OrderLine[]) {
        
        const groupedByOrderID: Record<number, OrderLine[]> = {};
      
        
        array.forEach((item) => {
          const orderID = item.OrderID;
          if (!groupedByOrderID[orderID]) {
            groupedByOrderID[orderID] = [];
          }
          groupedByOrderID[orderID].push(item);
        });
      
        const sortedArray = Object.values(groupedByOrderID).flatMap((group) =>
          group.sort((a, b) => a.OrderID - b.OrderID)
        );
      
        return sortedArray;
      }

    function groupByOrderId(array: OrderLine[]): GroupedOrder[] {
      const groupedOrdersMap = new Map<number, GroupedOrder>();
  
      array.forEach(item => {
          const orderId = item.OrderID;
  
          if (groupedOrdersMap.has(orderId)) {
              groupedOrdersMap.get(orderId)?.OrdersUnderOrderId.push(item);
          } else {
              const newGroup: GroupedOrder = {
                  OrderId: orderId,
                  OrdersUnderOrderId: [item]
              };
              groupedOrdersMap.set(orderId, newGroup);
          }
      });
  
      const groupedOrders = Array.from(groupedOrdersMap.values());
      return groupedOrders;
  }
  
  
  return (
    <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3} sx={{ padding: '2vh', marginTop:'2vh' }}>

          <Grid item xs={12} sm={4} md={2} lg={2} xl={2}>
              <div style={{ position: "sticky", top: "10%" }}>
                  <HeaderStyle>
                    Filter
                  </HeaderStyle>
                     {
                        groupByInitiated === false && !isLoading && packageIDValue !== 0 &&
                        <Chip
                          label={`Package ID: ${packageIDValue}`}
                          sx={{marginBottom:'2vh'}}
                          onDelete={()=>{
                            setPackageData(0)
                            setPackageIdOption(undefined);
                          }}
                        />
                    }
                    {
                      !isLoading && groupByInitiated === false &&
                            <Autocomplete
                            id="asynchronous-demo"
                            open={open}
                            onOpen={() => {
                              setOpen(true);
                            }}
                            onClose={() => {
                              setOpen(false);
                            }}
                            isOptionEqualToValue={(option, value) => option.packageType === value.packageType}
                            getOptionLabel={(option) => option.packageType}
                            options={options}
                            loading={filterLoad}
                            onChange={(event, value) => {
                                setPackageData(value === undefined || value === null ? 0 :  value.packageId)
                                setPackageIdOption(value?.packageId);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Package ID"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <React.Fragment>
                                      {filterLoad ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                    </React.Fragment>
                                  ),
                                }}
                              />
                            )}
                          />
                    }
                    {
                        packageIDValue === 0 && groupByInitiated === false && !isLoading &&
                        <Chip
                          label="Group By Order ID"
                          onClick={()=>setGroupByInitiated(true)}
                          sx={{marginBottom:'2vh', marginTop:"2vh"}}
                        />
                    } 
                    {
                        packageIDValue !== 0 && groupByInitiated === false && !isLoading &&
                        <Chip
                          label="Group By Stock Item ID"
                          sx={{marginBottom:'2vh', marginTop:"2vh"}}
                        />
                    } 
                     {
                         packageIDValue === 0 && groupByInitiated && 
                        <Chip
                          label="Group By Order ID"
                          color="primary"
                          onDelete={()=>setGroupByInitiated(false)}
                          sx={{marginBottom:'2vh', marginTop:"2vh"}}
                        />
                    }
              </div>
          </Grid>
          <Grid item  xs={12} sm={8} md={10} lg={10} xl={10} sx={{height:'100vh'}}>
          <div style={{ height: 400, width: '100%' }}>
          
          {
               isLoading ? 
               <>
                  <Box sx={{ width: '100%' }}>
                      <LinearProgress />
                  </Box>
                  <DataGrid
                      components={{
                      LoadingOverlay: LoadingSkeleton,
                      }}
                      loading
                      rows={[]}
                      columns={columns}
                  />
               </>
              
              :

              <>
                  {
                    groupByInitiated ? 

                    <>
                        <div>
                            {
                                currentRecords?.map((record, index) => 
                              
                                {
                                

                                  return   (
                                    <Accordion key={index} expanded={expanded === `order-${index}`} onChange={handleChange(`order-${index}`)}>
                                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                            <Typography>{`Order ID: ${record.OrderId} - (${record.OrdersUnderOrderId.length})`}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                              <DataGrid
                                                style={{ color: 'black' }}
                                                rows={record.OrdersUnderOrderId}
                                                columns={columns}
                                                initialState={{
                                                  columns: {
                                                    columnVisibilityModel: {
                                                      id: false,
                                                    },
                                                  },
                                                }}
                                              />
                                        </AccordionDetails>

                                    </Accordion>
                                )
                                }
                              
                                
                                )
                            }
                        </div>

                        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="secondary" variant="outlined"
                        sx={{marginTop:'2vh', marginBottom:'5vh'}}
                        />
                    </>

                    :
                    <DataGrid style={{color:'black'}}
                    rows={data || []}
                    columns={updatedColumns }
                    components={{ Toolbar: GridToolbar }}
                    initialState={{
                        columns: {
                          columnVisibilityModel: {
                            // Hide columns id, the other columns will remain visible
                            id: false,
                          },
                        }
                      }}
                    />

                  }
                
              </>
             
           }
              
          </div>

          </Grid>
         
        </Grid>
    </Box>
  )
}

export default Home
