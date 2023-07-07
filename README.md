<h1 align="center">
    Ukiyo Angular Challenge
</h1>

## Check the [LIVE VERCEL DEPLOYMENT](https://ukiyo-ng-challenge-public.vercel.app/challenge)

## Notes

### Fetching the data

`I added more children to the test data in order to test the functionalities.`

The test data is loaded via http client. It is stored in a json file (the assets directory).

Since the data is not paginated, I didn't implement lazy loaded fetching. I could have piped the incoming data and implemented some way of pagination, but it would take time. Also, it would have worked only for the first level table, but not for those on sublevels. I am saying that, because for the sublevel fetching I would have needed an parent reference to search for.

Instead, I made a minimalistic implementation for lazy loading based on scrolling or pagination with buttons.

`data.service.ts`

```ts

/* There are multiple ways of backend pagination, for this example I used the simplest approach.*/
fetchPaginated(maxPerPage:number, pageIdx:number, parentID?:number){
    //If the parent ID is specified, the response should include the parent's data with the paginated children's data.
    //If not, the response should include only the first level data.
    const apiRoute = parentID ? `<REST_API_ROUTE>/${parentID}`: '<REST_API_ROUTE>';
    const params = {maxPerPage, pageIdx};

    this.httpClient.get<Data>(apiRoute, {params}){

    }
}
```

Then, in the first level table, we would fetch the first level data. After that, in order to get lazy loaded data, we can use the scroll event or pagination buttons.

In order to pass data to the low level tables, there should be a refference to the parent level row, so the request could be done.

Also, while the request is resolved, we can display a loading spinner.

### State handling

The fetched data is of type Employee.

In order to keep a reference to the collapsed and expanded row levels I created the EmployeeModel type. The EmployeeModel has in addition the `collapsed` and `selected` fields that helped me obtain the expected behaviour.

I am aware that this is not the best approach because it is difficult to keep track of the application state. As a solution for this matter, in a high scaling application, state management libraries are being used (e.g. Redux).

### Row rotation

For me it was a little bit unclear, should I have used translate - rotation style? I tried to, but the spacing was not right. Instead, I projected the parent data on the first cell and I placed the nested/sublevel table inside of the other cells.

### Column resizing

It works, but for a reason, the columns that contain long values don't feel behaviorally correct. The column has to be squeezed by the other columns in order to get the resize behaviour as expected.

I'm still searching for my answer. :D

`Best solution found`: I used `width: min-width` for the table. It helped a lot, the cells are now resizing accordingly.

Another possible solution: I also tried to use the table-layout: fixed style, but, the relative/absolute positioning weren't working at all.

### Final note

I would've redesign the table so it could look much more better, but at the same moment I wanted to keep track of the objective requirements.

<br>
<h1 align="center">
🚀 Thank you! 🚀
</h1>
