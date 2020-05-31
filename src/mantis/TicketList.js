/**
 * @class Ext.ux.mantis.TicketList
 * 
 */
Ext.define('Ext.ux.mantis.TicketList', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'ticketlist',
    
    requires: [ 
        'Ext.ux.mantis.Ticket',
        'Ext.ux.mantis.store.Tickets',
        Ext.platformTags.desktop ? 'Ext.toolbar.Paging' : 'Ext.grid.PagingToolbar'
    ],

    //border: true,
    flex: 1,
    scrollable: true,
    bodyPadding: '10 10 10 10',

    config:
    {
        store: null,
        options: {},
        params: {}
    },

    style:
    {
        'border': '0px solid !important',
        'border-width': '0px !important'
    },

    layout: 
    {
        type: 'vbox',
        align : 'stretch',
        pack  : 'start'
    },

    dockedItems: [
    {
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        displayInfo: true
    }],

    defaults:
    {
        flex: 0
    },

    items: [

    ],

    listeners:
    {
        boxready: function()
        {
            this.initList();
        }
    },

    initList: function()
    {
        var me = this;

        me.setStore(me.getTicketStore());
        if (!me.getStore()) {
            return;
        }
        me.down('pagingtoolbar').setStore(me.getStore());

        me.getStore().on('beforeload', function() {
            if (!me.load) {
                me.load = true;
                me.refreshPage(this);
                return false;
            }
            return true;
        });

        me.load = true;
        me.refreshPage(me.getStore());
    },

    refreshPage: function(store)
    {
        var me = this;
        var mask = ToolkitUtils.mask(me, "Retrieving tickets");

        store.getTotalCount = function() { return 0; };
        me.getTicketCount().then(function(count)
        {
            if (count == 0) {
                ToolkitUtils.unmask(mask);
                me.load = false;
                me.removeAll();
                return;
            }

            store.getTotalCount = function() { return count; };
            store.load(
            {
                callback: function(records, options, success) 
                {
                    ToolkitUtils.unmask(mask);
                    me.load = false;
                    me.removeAll();
                    if (!success) {
                        Utils.alertError('Could not execute Mantis Rest API');
                        return;
                    }
                    me.suspendLayout = true;
                    for (var t in records) 
                    {
                        try {
                            me.add(Ext.create('Ext.ux.mantis.Ticket',
                            {
                                viewModel: { data: { record: records[t] } }
                            }));
                        }
                        catch(e) {
                            console.error(e);
                        }
                    }
                    me.suspendLayout = false;
                    me.updateLayout();
                }
            });
        }, function(e) { ToolkitUtils.unmask(mask); me.load = false; Utils.alertError(e); });
    },

    getTicketStore: function()
    {
        var me = this;

        if (!me.getOptions().token) {
            if (me.logger) {
                me.logger.error("Invalid token");
            }
            return null;
        }

        if (!me.getOptions().project_id) {
            if (me.logger) {
                me.logger.error("Invalid project");
            }
            return null;
        }
        
        var store = Ext.create('Ext.ux.mantis.store.Tickets',
        {
            options: me.getOptions()
        });
        
        //
        // If the token is specified at runtime, we need to reset proxy authorization
        //
        store.getProxy().setExtraParams(me.getParams());

        return store;
    },

    getTicketCount: function()
    {
        var me = this;
        var deferred = new Ext.Deferred();

        if (!me.getOptions().token) {
            if (me.logger) {
                me.logger.error("Invalid token");
            }
            return Ext.Deferred.reject("Invalid token");
        }

        if (!me.getOptions().project_id) {
            if (me.logger) {
                me.logger.error("Invalid project");
            }
            return Ext.Deferred.reject("Invalid project");
        }

        Ext.Ajax.request(
        {
            scope: this,
            method: 'GET',
            url: me.getOptions().location + 'plugins/ApiExtend/api/issues/count/' + me.getOptions().project_name,
            headers: { Authorization: me.getOptions().token },
            failure: function(response, options)
            {
                deferred.reject('Could not execute Mantis Rest API for getTicketCount()');
            },
            success: function(response, options)
            {
                var jso;
                try {
                    jso = Ext.util.JSON.decode(response.responseText);
                } 
                catch(e) {
                    deferred.reject('Exception thrown executing Mantis Rest API for getTicketCount()');
                    return;
                }
                
                if (!jso.count && jso.count !== 0) {
                    deferred.reject("Could not retrieve ticket count.<br><br>" + jso.message);                       
                    return;
                }

                //
                // Success
                //
                deferred.resolve(jso.count);
            },
            params: Ext.merge(
            { 
                project_id: me.getOptions().project_id,
                hide_status:-2
            }, me.getParams() ? me.getParams() : {})
        });

        return deferred.promise;
    }
    
});
