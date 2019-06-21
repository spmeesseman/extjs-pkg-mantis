
Ext.define('Ext.ux.mantis.store.FieldStore', 
{
    extend: 'Ext.data.Store',
    alias: 'store.mantis.fieldstore',

    model: 'Ext.ux.mantis.model.Field',

    autoLoad: true,
    fieldName: null,

    listeners:
    {
        // eslint-disable-next-line consistent-return
        beforeload: function(store, operation, eopts)
        {
            if (!Ext.manifest.mantis.token) {
                return false;
            }

            if (!store.fieldName) { //(!store.getModel() || !store.getModel().fieldName) {
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
                
                proxy.setExtraParams({ option: store.fieldName });
            }
            catch(e) {}
        }
    },

    proxy: {
        type: 'rest',
        url: 'https://app1.development.pjats.com/projects/api/rest/config',
        useDefaultXhrHeader: false,
        headers:
        {
            Authorization: Ext.manifest.mantis.token
        },
        reader:
        {
            type: 'json',
            rootProperty: function(data) {
                return data.configs[0].value;
            }
        }
    }
    
});
