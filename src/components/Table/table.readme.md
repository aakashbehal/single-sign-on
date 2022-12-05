# Table

Table usage

## Usage

```javascript
<TableComponent
                data={accounts}
                isLoading={isLoadingAccounts}
                map={accountMap}
                totalCount={totalCount}
                actionArray={['originalAccountNumber', 'consumerName']}
                handleNavigate={(data, column) => showAccountDetailPage(data, column)}
                currencyColumns={["chargeOffBalance", "currentBalance"]}
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                parentComponent={'account/consumer/inventory'}
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent>
```

#### Data
```Javascript
[{key1: value1}, {key2: value2}]
```
#### isLoading
```Javascript

```