/**
 * @class Ext.ux.mantis.store.Base
 * 
 */
Ext.define('Ext.ux.mantis.store.Base', 
{
    extend: 'Ext.data.Store',
    alias: 'store.mantis.base',
    
    model: 'Ext.data.Model',
    autoLoad: true,
    
    xtraParams: {},

    config:
    {
        options: {}
    },

    listeners:
    {
        // eslint-disable-next-line consistent-return
        beforeload: function(store, operation, eopts)
        {
            if (!store.getOptions().token) {
                Ext.Msg.alert("Error", "Mantis token is not set in Ext manifest");
                return false;
            }

            if (!store.getOptions().project_id) {
                Ext.Msg.alert("Error", "Mantis project_id is not set in Ext manifest");
                return false;
            }

            if (!store.getOptions().location) {
                Ext.Msg.alert("Error", "Mantis location is not set in Ext manifest");
                return false;
            }

            //
            // Set authorization header and config field name in proxy
            //
            try
            {
                var proxy = store.getProxy();

                proxy.setHeaders({
                    Authorization: store.getOptions().token
                });
                
                Ext.merge(store.xtraParams, { 
                    project_id: store.getOptions().project_id 
                });
                
                var model = store.model.create();
                if (model.xtraParams) {
                    Ext.merge(store.xtraParams, model.xtraParams);
                }
                model = null;
                
                var xParams = proxy.getExtraParams();
                if (!xParams) {
                    xParams = {};
                }
                Ext.merge(xParams, store.xtraParams);
                proxy.setExtraParams(xParams);

                var url = proxy.getUrl();
                if (url.indexOf(store.getOptions().location) === -1) {
                    proxy.setUrl(store.getOptions().location + url);
                }
            }
            catch(e) {}
        }
    }
    
});
