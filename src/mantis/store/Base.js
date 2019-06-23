
Ext.define('Ext.ux.mantis.store.Base', 
{
    extend: 'Ext.data.Store',
    alias: 'store.mantis.base',
    
    model: 'Ext.data.Model',
    autoLoad: true,
    
    xtraParams: {},

    listeners:
    {
        // eslint-disable-next-line consistent-return
        beforeload: function(store, operation, eopts)
        {
            if (!Ext.manifest.mantis.token) {
                Ext.Msg.alert("Mantis token is not set");
                return false;
            }

            if (!Ext.manifest.mantis.project_id) {
                Ext.Msg.alert("Mantis project_id is not set");
                return false;
            }

            if (!Ext.manifest.mantis.location) {
                Ext.Msg.alert("Mantis location is not set");
                return false;
            }

            //
            // Set authorization header and config field name in proxy
            //
            try
            {
                var proxy = store.getProxy();

                proxy.setHeaders(
                {
                    Authorization: Ext.manifest.mantis.token
                });
                
                Ext.merge(store.xtraParams, { project_id: Ext.manifest.mantis.project_id });
                
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
            }
            catch(e) {}
        }
    }
    
});
