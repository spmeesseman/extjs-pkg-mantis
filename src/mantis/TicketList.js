
Ext.define('Ext.ux.mantis.TicketList', 
{
    extend: 'Ext.panel.Panel',
    xtype: 'ticketlist',
    
    requires: [ 
        'Ext.ux.mantis.Ticket',
        'Ext.ux.mantis.store.Tickets',
        Ext.platformTags.desktop ? 'Ext.toolbar.Paging' : 'Ext.grid.PagingToolbar'
    ],

    border: false,
    flex: 1,
    scrollable: true,

    config:
    {
        store: null,
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
        pageSize: 25,
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
        me.getTicketCount().then((count) =>
        {
            console.warn(store);
            store.getTotalCount = function() { return count; };
            store.getProxy().setExtraParams(Ext.merge({ project_id: Ext.manifest.mantis.project_id }, me.getParams() ? me.getParams() : {}));
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
                }
            });
        }, (e) => { ToolkitUtils.unmask(mask); me.load = false; Utils.alertError(e); });
    },

    getTicketStore: function()
    {
        var me = this;

        if (!Ext.manifest.mantis.token) {
            if (me.logger) {
                me.logger.error("Invalid token");
            }
            return null;
        }

        if (!Ext.manifest.mantis.project_id) {
            if (me.logger) {
                me.logger.error("Invalid project");
            }
            return null;
        }
        
        var store = Ext.create('Ext.ux.mantis.store.Tickets');

        //
        // If the token is specified at runtime, we need to reset proxy authorization
        //
        var proxy = store.getProxy();
        proxy.setHeaders({ Authorization: Ext.manifest.mantis.token });

        return store;
    },

    getTicketCount: function()
    {
        var me = this;
        var deferred = new Ext.Deferred();

        if (!Ext.manifest.mantis.token) {
            if (me.logger) {
                me.logger.error("Invalid token");
            }
            return Ext.Deferred.reject("Invalid token");
        }

        if (!Ext.manifest.mantis.project_id) {
            if (me.logger) {
                me.logger.error("Invalid project");
            }
            return Ext.Deferred.reject("Invalid project");
        }

        var store = me.getTicketStore();

        store.setPageSize(250);
        store.getProxy().setExtraParams(Ext.merge({ project_id: Ext.manifest.mantis.project_id }, me.getParams() ? me.getParams() : {}));
        
        store.load(
        {
            scope: this,
            callback: function(records, options, success) 
            {
                if (!success) {
                    deferred.reject('Could not execute Mantis Rest API for getTicketCount()');
                }
                deferred.resolve(records ? records.length : 0);
            }
        });

        return deferred.promise;
    }
    
});
