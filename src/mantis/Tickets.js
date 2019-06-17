
Ext.define('Ext.ux.mantis.Tickets', 
{
    extend: 'Ext.tab.Panel',
    xtype: 'tickets',
    
    requires: [ 
        'Ext.ux.mantis.Trac',
        'Ext.ux.mantis.Ticket'
    ],

    flex:1,
    border: false,
    bodyPadding: '5 5 5 5',

    items: [
    {
        title: 'Open Tickets',
        scrollable: true,
        iconCls: 'far fa-bars',
        layout: 
        {
            type: 'vbox',
            align : 'stretch',
            pack  : 'start'
        },
        items: [
        {
            layout: 
            {
                type: 'vbox',
                align : 'stretch',
                pack  : 'start'
            }
        }]
    }],

    listeners:
    {
        boxready: function()
        {
            var me = this;
            var view = me.up('help');
            var mask = ToolkitUtils.mask(view, "Retrieving your tickets");
            Trac.getTickets().then((tickets) =>
            {
                ToolkitUtils.unmask(mask); 
                Utils.log("Got " + tickets.length + " tickets", 1);
                if (!tickets) {
                    return;
                }
                Utils.logValue("   Tickets", tickets, 2);
                for (var t in tickets) {
                    try {
                        me.items.items[0].items.items[0].add(Ext.create('GEMS.view.miscellaneous.help.Ticket',
                        {
                            viewModel: { data: { record: tickets[t] } }
                        }));
                    }
                    catch(e) {
                        console.error(e);
                    }
                }
            }, (e) => { ToolkitUtils.unmask(mask); Utils.alertError(e); });
        }
    }
    
});
