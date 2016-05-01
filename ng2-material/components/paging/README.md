# MdPaging
MdPaging allow you to use pagination related to your datas. There's any real recommandations about paging 
but this component follow [this example](http://www.google.com/design/spec/components/data-tables.html#data-tables-interaction)

## MdPaging

Main component of the paging

### Properties
| Name | Type | Description |
| --- | --- | --- |
| name | string | Group paging by name to enable multiple instance of MdPaging on the same page |
| model | IPagingModel | Model that include pagination informations: *currentPage*, *itemsPerPage*, *totalItems* |
| controls | boolean | Toggle the display of controls |
| range | boolean | Toggle the display of range |
| rangeFormat | string | Override the default format of the range by using `{start}`, `{end}`, `{total}` keys |
| lengthSelector | boolean | Toggle the display of length selector |
| selectorLengthBefore | string | Prepend length selector with a string |
| selectorLengthAfter | string | Append length selector with a string |
| selectorLengthAvailable | Array<number> | available lengths to display in the combobox. If you don't provide choices, the selector won't be displayed |
           
### Events
| Name | Type | Description |
| --- | --- | --- |
| onPageChange | EventEmitter<IPagingChange> | Emitted when something change on the model: *currentPage*, *itemsPerPage*, *totalItems* |


## MdPagingLengthSelector

Length selector component

### Properties
| Name | Type | Description |
| --- | --- | --- |
| name | string | Group paging by name to enable multiple instance of MdPaging on the same page |
| model | IPagingModel | Model that include pagination informations: *currentPage*, *itemsPerPage*, *totalItems* |
| selectorLengthBefore | string | Prepend length selector with a string |
| selectorLengthAfter | string | Append length selector with a string |
| selectorLengthAvailable | Array<number> | available lengths to display in the combobox. If you don't provide choices, the selector won't be displayed |


## MdPagingControls

Paging controls component

### Properties
| Name | Type | Description |
| --- | --- | --- |
| name | string | Group paging by name to enable multiple instance of MdPaging on the same page |
| model | IPagingModel | Model that include pagination informations: *currentPage*, *itemsPerPage*, *totalItems* |


## MdPagingRange

Range display component

### Properties
| Name | Type | Description |
| --- | --- | --- |
| name | string | Group paging by name to enable multiple instance of MdPaging on the same page |
| model | IPagingModel | Model that include pagination informations: *currentPage*, *itemsPerPage*, *totalItems* |
| rangeFormat | string | Override the default format of the range by using `{start}`, `{end}`, `{total}` keys |

## PagingService

It's the service that help paging components to communicate between them. You can subscribe to the `onChange` property or push changes via `change` function of this service 
but you should avoid this and prefer subscribing to `onPageChange` output of `MdPaging`.
