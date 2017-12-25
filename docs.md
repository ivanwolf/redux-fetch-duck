## Functions

<dl>
<dt><a href="#types">types(resourceName)</a> ⇒ <code><a href="#ActionTypes">ActionTypes</a></code></dt>
<dd><p>Return the three action tyoes for a given resource.</p>
</dd>
<dt><a href="#actionCreators">actionCreators(resourceName)</a> ⇒ <code><a href="#ActionCreators">ActionCreators</a></code></dt>
<dd><p>Returns three action creators for a given resource.</p>
</dd>
<dt><a href="#thunkCreator">thunkCreator(resourceName, callApi, [dataSelector], [errorSelector])</a> ⇒ <code><a href="#Thunk">Thunk</a></code></dt>
<dd><p>Create the fetch thunk creator. Do not forget to dispatch the thunk call at the moment of the fetch.</p>
</dd>
<dt><a href="#withFetch">withFetch(resourceName)</a> ⇒ <code>function</code></dt>
<dd><p>Returns a High order reducer wich creates the fetching resource and merge other reducers.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Action">Action</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ActionTypes">ActionTypes</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ActionCreators">ActionCreators</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Thunk">Thunk</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="types"></a>

## types(resourceName) ⇒ [<code>ActionTypes</code>](#ActionTypes)
Return the three action tyoes for a given resource.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| resourceName | <code>string</code> | The name of the resource being fetched |

<a name="actionCreators"></a>

## actionCreators(resourceName) ⇒ [<code>ActionCreators</code>](#ActionCreators)
Returns three action creators for a given resource.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| resourceName | <code>string</code> | The name of the resource. |


* [actionCreators(resourceName)](#actionCreators) ⇒ [<code>ActionCreators</code>](#ActionCreators)
    * [.request()](#actionCreators.request) ⇒ [<code>Action</code>](#Action)
    * [.success(data)](#actionCreators.success) ⇒ [<code>Action</code>](#Action)
    * [.failure(error)](#actionCreators.failure) ⇒ [<code>Action</code>](#Action)

<a name="actionCreators.request"></a>

### actionCreators.request() ⇒ [<code>Action</code>](#Action)
Request action creator. This actions indicates the API will be called.

**Kind**: static method of [<code>actionCreators</code>](#actionCreators)  
<a name="actionCreators.success"></a>

### actionCreators.success(data) ⇒ [<code>Action</code>](#Action)
Success action creator. This action passes the data to the reducer.

**Kind**: static method of [<code>actionCreators</code>](#actionCreators)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> \| <code>string</code> \| <code>number</code> | The data received from the API call. |

<a name="actionCreators.failure"></a>

### actionCreators.failure(error) ⇒ [<code>Action</code>](#Action)
Failure action creator. This actions passes the error to the reducer.

**Kind**: static method of [<code>actionCreators</code>](#actionCreators)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>object</code> \| <code>error</code> | The error received from the response. |

<a name="thunkCreator"></a>

## thunkCreator(resourceName, callApi, [dataSelector], [errorSelector]) ⇒ [<code>Thunk</code>](#Thunk)
Create the fetch thunk creator. Do not forget to dispatch the thunk call at the moment of the fetch.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| resourceName | <code>string</code> | The name of the resource beeing fetched |
| callApi | <code>function</code> | This function is called with the args passed to Thunk created with this method. Must return a Promise representing the response. |
| [dataSelector] | <code>function</code> | Function to select the data payload from the response object. |
| [errorSelector] | <code>function</code> | Function to select the error payload from the response object. |

<a name="withFetch"></a>

## withFetch(resourceName) ⇒ <code>function</code>
Returns a High order reducer wich creates the fetching resource and merge other reducers.

**Kind**: global function  

| Param | Type |
| --- | --- |
| resourceName | <code>string</code> | 

<a name="withFetch..combine"></a>

### withFetch~combine([reducers])
Creates the final reducer.

**Kind**: inner method of [<code>withFetch</code>](#withFetch)  

| Param | Type | Description |
| --- | --- | --- |
| [reducers] | <code>object</code> | This args is passed to combineReducers |

<a name="Action"></a>

## Action : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of de action |
| payload | <code>object</code> \| <code>error</code> | The data asociated to de action |
| error | <code>boolean</code> | Indicates if the payload is an error |

<a name="ActionTypes"></a>

## ActionTypes : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| request | <code>string</code> | 
| success | <code>string</code> | 
| failure | <code>string</code> | 

<a name="ActionCreators"></a>

## ActionCreators : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| request | <code>function</code> | 
| success | <code>function</code> | 
| failure | <code>function</code> | 

<a name="Thunk"></a>

## Thunk : <code>function</code>
**Kind**: global typedef  
