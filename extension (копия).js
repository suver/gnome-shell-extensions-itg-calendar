
const Lang = imports.lang;
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const Gettext = imports.gettext;
const MessageTray = imports.ui.messageTray;
const PopupMenu = imports.ui.popupMenu;
const Calendar = imports.ui.calendar;
const DateMenu = imports.ui.dateMenu;
const PanelMenu = imports.ui.panelMenu;

const _ = Gettext.gettext;

let tasksBox;

const dateFormat = _("%A %e, %Y");

const MYPLACES_ICON_SIZE = 22;

/* Handles the vertical separator look
* Function borrowed from dateTime.js */
function _onVertSepRepaint(area) {
    let cr = area.get_context();
    let themeNode = area.get_theme_node();
    let [width, height] = area.get_surface_size();
    let stippleColor = themeNode.get_color('-stipple-color');
    let stippleWidth = themeNode.get_length('-stipple-width');
    let x = Math.floor(width/2) + 0.5;
    cr.moveTo(x, 0);
    cr.lineTo(x, height);
    Clutter.cairo_set_source_color(cr, stippleColor);
    cr.setDash([1, 3], 1); // Hard-code for now
    cr.setLineWidth(stippleWidth);
    cr.stroke();
}


/* Inserts a task button in the UI (if it's one of the top K)
 */
function _insertTaskAtIndex(index, task) {
       /* if the task is due soon, add it to the UI */
       task.button = _prepareTaskButton(task);
       tasksBox.insert_actor(task.button, index, {expand: true});
}

/* Creates a task button
 */
function _prepareTaskButton(task) {
    let title = task.title.substr(0, 70);
    if (title.length != task.title.length) title += '...';
    let style_class = 'events-day-task';
    if (task.due_today) {style_class += ' due-today';}
    let task_button = new PopupMenu.PopupMenuItem(title,
                        {style_class: style_class});
    task_button.connect('activate', partial(onTaskClicked, task.id));
    return task_button.actor;
}

function HelloWorldExtension() {
	this._init();
}

HelloWorldExtension.prototype = {
	__proto__: PanelMenu.Button.prototype,
	_init: function() {
		PanelMenu.Button.prototype._init.call(this, 0.0);

		function getChildByName (a_parent, name) {
			return a_parent.get_children().filter(
				function(elem){
					return elem.name == name
				}
			)[0];
    		}

		this.calendarArea = getChildByName(Main.panel._dateMenu.menu.box, 'calendarArea');

		this.button = new St.Bin({ style_class: 'panel-button',
					reactive: true,
					can_focus: true,
					x_fill: true,
					y_fill: false,
					track_hover: true });
	
		this.text = null;
		let icon = new St.Icon({ icon_name: 'system-run',
					icon_type: St.IconType.SYMBOLIC,
					style_class: 'system-status-icon' });
 
		this.button.set_child(icon);
		this.button.connect('button-press-event', Lang.bind(this, this._showHello));
		
		global.log("Hello World!");

		/* Add GTG widget */
		/*
		separator = new St.DrawingArea({
						style_class: 'calendar-vertical-separator',
						pseudo_class: 'highlighted' 
		});
		separator.connect('repaint', Lang.bind(this, _onVertSepRepaint));
		calendarArea.add_actor(separator);

		gtgBox = new St.BoxLayout( {vertical: true} );
		calendarArea.add_actor(gtgBox, {expand: true});

    tasksBox = new St.BoxLayout();
    tasksBox.set_vertical(true);
    gtgBox.add(tasksBox, {style_class: 'calendar'});

    
    let open_gtg_button = new PopupMenu.PopupMenuItem("Open GTG");
    open_gtg_button.connect('activate', function () {
        Main.panel._dateMenu.menu.close();
        showTaskBrowser();
    });
	

    open_gtg_button.actor.can_focus = false;
    gtgBox.add(open_gtg_button.actor,
               {y_align: St.Align.END,
                expand: true,
                y_fill: false});
*/

	let timesBox = new St.BoxLayout( {name: 'timesWorldArea',vertical: true} );
        this.calendarArea.add(timesBox);

	let separator = new PopupMenu.PopupSeparatorMenuItem();
	separator.setColumnWidths(1);
	timesBox.add(separator.actor, {y_align: St.Align.END, expand: true, y_fill: false});

	displayDate = new Date();
        timesBox.add(new St.Label({ style_class: 'events-day-header', text: displayDate.toLocaleFormat(dateFormat) }));

/*
item = new PopupMenu.PopupMenuItem(_("Open Calendar 1"));
            item.connect('activate', Lang.bind(this, this._showHello));
            item.actor.can_focus = false;
            this.menu.addMenuItem(item.actor, {y_align: St.Align.END, expand: true, y_fill: false});
*/
		/*

		function getChildByName (a_parent, name) {
			return a_parent.get_children().filter(
				function(elem){
					return elem.name == name
				}
			)[0];
		}
		
		let calendarArea = getChildByName(Main.panel._dateMenu.menu.box, 'calendarArea');
		hbox = new St.BoxLayout({name: 'calendarArea' });
		this.addActor(hbox);

		vbox = new St.BoxLayout({vertical: true});
		hbox.add(vbox);

		// Date
		this._date = new St.Label();
		this._date.style_class = 'datemenu-date-label';
		vbox.add(this._date);
		
		
		let calendarArea = getChildByName(Main.panel._dateMenu.menu.box, 'calendarArea');
		global.log(calendarArea);

		separator = new St.DrawingArea({style_class: 'calendar-vertical-separator',
						pseudo_class: 'highlighted' });
		separator.connect('repaint', Lang.bind(this, _onVertSepRepaint));
		calendarArea.add_actor(separator);

		gtgBox = new St.BoxLayout();
		gtgBox.set_vertical(true);
		calendarArea.add_actor(gtgBox, {expand: true});
		tasksBox = new St.BoxLayout();
		tasksBox.set_vertical(true);
		gtgBox.add(tasksBox, {style_class: 'calendar'});

		// Add "Open GTG" button 
		let open_gtg_button = new PopupMenu.PopupMenuItem("Open GTG");
		open_gtg_button.connect('activate', function () {
			Main.panel._dateMenu.menu.close();
			showTaskBrowser();
		});
		open_gtg_button.actor.can_focus = false;
		gtgBox.add(open_gtg_button.actor, {
				y_align: St.Align.END,
				expand: true,
				y_fill: false});
		*/

	},

	_myNotify: function (text) {
		global.log("_myNotify called: " + text);

		let source = new MessageTray.SystemNotificationSource();
		Main.messageTray.add(source);
		let notification = new MessageTray.Notification(source, text, null);
		notification.setTransient(true);
		source.notify(notification);
	},

	_hideHello: function() {
		Main.uiGroup.remove_actor(this.text);
		this.text = null;
	},

	_showHello: function() {
		if (!this.text) {
			this.text = new St.Label({ 
				style_class: 'helloworld-label', 
				text: "Hello, world!" 
			});
			Main.uiGroup.add_actor(this.text);
		}

		this.text.opacity = 255;

		let monitor = Main.layout.primaryMonitor;

		this.text.set_position(	Math.floor(monitor.width / 2 - this.text.width / 2),
					Math.floor(monitor.height / 2 - this.text.height / 2));
 		
		global.log("Hello World!");
 		global.logError ("HL");

		Tweener.addTween(this.text, { 
				opacity: 0,
				time: 1,
				transition: 'easeOutQuad',
				onComplete: function() {
					Main.uiGroup.remove_actor(this.text);
					this.text = null;
				}
		});
	},

	enable: function() {
		Main.panel._rightBox.insert_actor(this.button, 0);
	},

	disable: function() {
		Main.panel._rightBox.remove_actor(this.button);
	}
};


function init() {
	return new HelloWorldExtension();
}





