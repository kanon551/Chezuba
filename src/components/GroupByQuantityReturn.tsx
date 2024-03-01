import React, {  useEffect, useState } from 'react'
import { OrderLine, columns, groupAndSortArray, groupBy } from '../utils/GlobalApi';
import Pagination from '@mui/material/Pagination';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { styled as Styled } from '@mui/material/styles';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

interface groupByProps {
    array: OrderLine[];
    index: number;
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

  


const GroupByQuantityReturn = ({array, index}: groupByProps) => {

    const resultArray = groupAndSortArray(array, "Quantity");
    const result = groupBy(resultArray, "Quantity");
    const [presentPage, setPresentPage] = useState<number>(1);
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const recordsPerPage = 5;
    const startIndex = (presentPage - 1) * recordsPerPage;
    const totalQuantityPages =  result !== undefined && result.length !== 0 ? Math.ceil( result.length / recordsPerPage) : 0;
    const endIndex = startIndex + recordsPerPage;
    const quantityRecordsALone = result?.slice(startIndex, endIndex);

    const handlePgChange = (event: React.ChangeEvent<unknown>, page: number) => {
      setPresentPage(page);
    };

    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
    
  return (
    <>
            <div>
                {
                    quantityRecordsALone?.map((record, index) =>  {
                      return   (
                        <Accordion 
                        key={index} 
                        expanded={expanded === `Quantity-${index}`} 
                        onChange={handleChange(`Quantity-${index}`)}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>{`Quantity: ${record.groupByKeyValue} - (${record.OrdersUnderGroupByKeyValue.length})`}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                  <DataGrid
                                    style={{ color: 'black' }}
                                    rows={record.OrdersUnderGroupByKeyValue}
                                    columns={columns}
                                    initialState={{
                                      columns: {
                                        columnVisibilityModel: {
                                          id: false,
                                        },
                                      },
                                      pagination: { paginationModel: { pageSize: 10 } },
                                    }}
                                  />
                            </AccordionDetails>

                        </Accordion>
                    )
                    }
                  
                    
                    )
                }
            </div>

            <Pagination count={totalQuantityPages} page={presentPage} onChange={handlePgChange} color="secondary" variant="outlined"
            sx={{marginTop:'2vh', marginBottom:'5vh'}}
            />
        </>
  )
}

export default GroupByQuantityReturn
