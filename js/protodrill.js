var ProtoDrill = Class.create({ 
	active:false,
	image_dir: '../images/',
	settings: {
		width: 300
	},
	
	// do not touch below!
	active_element: null,
	
	initialize: function(element, options){
		//this.loadCss();
		
		this.element = $(element);
		this.settings.width = (options.width); //this.element.getWidth();
		this.element.writeAttribute({'onclick':'return false'});
		
		this.form_element = new Element('input', {'type':'hidden', 'name':options.form_element});
		this.element.insert({after:this.form_element});
		
		this.container = new Element('div');
		this.container.setStyle({width:(this.settings.width)+'px'});
		this.container.hide();
		
		this.back_button = new Element('a', {'href':'#'}).update('&laquo;Back');
		
		this.crumble = new Element('div', {'class':'protodrill_crumble'});
		this.crumble.insert(new Element('span'));
		this.crumble.insert(this.back_button);
		this.crumble.hide();
		
		this.list_container = new Element('div', {'class':'protodrill_container'});
		this.list_container.setStyle({'position':'relative'});

		this.container.insert(this.crumble);
		this.container.insert(this.list_container);
		this.element.insert({after:this.container});

		this.setHandlers();
		this.loadContent();
	},

	setHandlers: function(){
		this.element.observe('click', function(e){
			this.toggleSelectorActive();
		}.bind(this));
		
		this.back_button.observe('click', this.showPreviousLevel.bind(this));
	},

	loadCss: function(){
		var fileref=document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", '/css/protodrill.css');
		document.getElementsByTagName('head')[0].appendChild(fileref);
	},
	
	setupDrillMenu: function(){
		this.list = this.list_container.down('ul');
		
		this.list.descendants().each(function(s) {
			if(s.nodeName=='LI'){
				if(s.down('ul')){
					s.down('ul').setStyle({'left':this.settings.width+'px', 'width':this.settings.width+'px'});
					nextlvl_img = new Element('img', {'src':this.image_dir+'next.png', 'align':'right'});
					s.insert({top:nextlvl_img});
					s.observe('click', this.showNextLevel.bind(this));
				}
				else{
					s.observe('click', this.selectItem.bind(this));
				}

				s.observe('mouseover', function(e){Event.element(e).addClassName('protodrill_over')});
				s.observe('mouseout', function(e){Event.element(e).removeClassName('protodrill_over')});
			}
		}, this);
        
		this.list.immediateDescendants().invoke('setStyle', {display:'block', left:'0'});
	},

	showNextLevel: function(e){
		clicked_element = Event.element(e);
		parent_ul = clicked_element.up('ul');
		child_ul  = clicked_element.down('ul');
		
		if(child_ul){
			//child_ul.setStyle({display:'block', left:this.settings.width});
			new Effect.Move(child_ul, { x: 0, y: 0, mode: 'absolute', duration:0.5 });
			this.active_element = child_ul;
			
			crumb_text = clicked_element.cleanWhitespace().childNodes[1].nodeValue.strip();
			this.crumble.down('span').update(crumb_text);
			this.crumble.show();
		}
	},
	
	showPreviousLevel: function(e){
		parent_ul = this.active_element.up('ul');
		
		if(parent_ul){
			new Effect.Move(this.active_element, { x: this.settings.width, y: 0, mode: 'relative', duration:0.5 });
			this.active_element = parent_ul;
		}
		if(parent_ul.up('ul')){
			this.crumble.show();
			crumb_text = parent_ul.up('li').cleanWhitespace().childNodes[1].nodeValue.strip();
			this.crumble.down('span').update(crumb_text);
		}
		else this.crumble.hide();
	},
	
	selectItem: function(e){
		s_element = Event.element(e);
		id = s_element.id.split('_');
		this.form_element.value = id[1];
		
		if(this.selected_element){
			this.selected_element.removeClassName('protodrill_selected_item');
		}
		
		this.selected_element = s_element;
		this.selected_element.addClassName('protodrill_selected_item');
	
		this.element.update(this.selected_element.innerHTML);
		
		this.closeSelector();
	},
	closeSelector: function(){
		this.element.removeClassName('protodrill_selector_active');
		this.container.hide();
		this.active = false;
	},
	openSelector: function(){
		this.element.addClassName('protodrill_selector_active');
		this.container.show();
		this.active = true;
	},
	toggleSelectorActive: function(){
		if (this.active){
			this.closeSelector();
		}
		else{
			this.openSelector();
		}
	},
	
	createListFromJson: function(data){
		this.list = this.createUl(data);
		this.list_container.insert(this.list);
		
		this.setupDrillMenu();
	},
	createUl: function(items){
		var ul = new Element('ul');
		
		items.each(function(item){
			var li = new Element('li',{'id':"item_"+item.id}).update(item.name);
			
			if(item.children){
				li.insert(this.createUl(item.children));
			}
			ul.insert(li);
		}, this);
		
		return ul;
	},
	loadContent: function(){

		new Ajax.Request(this.element.href, {
			method: 'get',
			onComplete: function(transport, json){
				if(this.element.href.endsWith('.js')){
					// expect json
					data = transport.responseText.evalJSON();
					this.createListFromJson(data);
				}
				else{
					//expect html list
					this.list_container.update(transport.responseText);
					this.setupDrillMenu();
				}
				
			}.bind(this)
		});
	}
}); 

Object.extend(ProtoDrill, {}); 

Element.addMethods({
	textNodes: function(element){
		return $A(element.childNodes).select( function(child){ return
		child.nodeType == 3; } );
	}
});
