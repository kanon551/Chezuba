# UI for Minizuba

# Tech Stack
1. React
2. Typescript
3. Material-ui
4. Axios
5. React-error-boundary 
6. React-query
7. Context API

# Build UI for order lines API
# Terminology:
Orderline - A customer can order multiple products of different quantities. All similar products would be marked as one orderline and the quantity would be mentioned on the orderline entry.
Package type - The type of packaging each item in orderline needs. This is unique for a particular orderline entry.
# Context:
Minizuba is a packaging solution startup. The “Packaging Supervisor” at Minizuba receives a list of the products that need to be packed through an API endpoint. Then a list of items is distributed to each packaging team depending on the type of package. Navigating the API poses challenges for the supervisor.

# Problem statement:
Develop an application that displays all the orderlines(14 types) on UI. You can access the Minizuba API to fetch the relevant information.

# Implement the following:
Packaging orders displayed in a list view
When no filters are applied all orderlines should be displayed.
“OrderLineID” as the first column(extreme left)
Items are always sorted in ascending order of “OrderLineID”
Ensure fast loading of list items for user convenience
Ability to filter by “Quantity”

Ensure usability remains smooth even in slow network conditions
Grouping by “OrderID” 
Grouping by “UserID”
Rich and responsive UI
Unit test cases
Color code each package type.

Mention the features that were implemented in README.md file.
# About the API:
Use the following API endpoint to fetch orderlines.

Request:

Request URL: 	https://minizuba-fn.azurewebsites.net/api/orderlines
Request Method:	GET
Params:		- [required] typeID: int
- [optional] quantity: int

typeID - ID of the packaging type. There are 14 types of packaging options available. The value ranges from 1 to 14.
quantity - Number of items ordered under one orderline.

Response:
Results are ordered in ascending order of OrderLineID

# Sample response:
[{
"OrderLineID": 307, 
"OrderID": 151, 
"StockItemID": 200, 
"Description": "Black and yellow heavy despatch tape 48mmx100m", 
"PackageTypeID": 1, 
"Quantity": 96, 
"UnitPrice": 4.1
}]


# Note: Consider this as a production scenario and include all required elements.
