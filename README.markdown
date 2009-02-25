# ProtoDrill
### An Ipod style, prototype based drill down menu

## TODO

* Writing this Readme file
* Browser testing
* Making a Rails plugin
* Make it degrade gracefully to a combobox
* Make it possible to ajax-load only the current siblings and their immediate children (otherwise handling a tree with 1000+ elements is painfully slow)

## How to use

First include the needed javascript and css

	<script type="text/javascript" src="js/prototype.js"></script>
	<script type="text/javascript" src="js/scriptaculous.js"></script>
	
	<script type="text/javascript" src="js/protodrill.js"></script>
	<link rel="stylesheet" href="/css/protodrill.css" type="text/css" media="screen" charset="utf-8">	

Then make a link to the file containing the tree (html list or json nested set)

	<a href="menu.js" id="drillmenu" class="protodrill_selector">Click to select ...</a>
	<script type="text/javascript">new ProtoDrill('drillmenu', {width:'300', form_element:'element_id'});</script>
	
The format of file containing your tree is:
**HTML**

	`<ul>
		<li id="element_1">item 1
			<ul>
				<li id="element_2">item 1.1</li>
				<li id="element_3">item 1.2</li>
			</ul>
		</li>
		<li id="element_4">item 2
			<ul>
				<li id="element_5">item 2.1</li>
				<li id="element_6">item 2.2</li>
			</ul>
		</li>
	</ul>`
*note: the id of the li elements will be the value for the form element (only the number after the _)*

**JSON**

	`[
		{"name":"item 1", "id":"1", "children":[
			{"name":"item 1.1", "id":"2"}, 
			{"name":"item 1.2", "id":"3"}]
		},
		{"name":"item 2", "id":"4", "children":[
			{"name":"item 2.1", "id":"5"}, 
			{"name":"item 2.2", "id":"6"}]
		}
	]`
	
## Demo

coming soon ...

	

### License

ProtoDrill is released under the MIT license.