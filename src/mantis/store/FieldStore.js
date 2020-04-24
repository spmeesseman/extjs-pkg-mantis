/**
 * @class Ext.ux.mantis.store.FieldStore
 * 
 */
Ext.define('Ext.ux.mantis.store.FieldStore', 
{
    extend: 'Ext.ux.mantis.store.Base',
    alias: 'store.mantis.fieldstore',

    model: 'Ext.ux.mantis.model.Field',
    xtraParams: { option: '' },

    proxy: {
        type: 'rest',
        url: 'api/rest/config',
        useDefaultXhrHeader: false,
        reader:
        {
            type: 'json',
            rootProperty: function(data) {
                if (data.configs && data.configs.length > 0) {
                    return data.configs[0].value;
                }
                return data.configs;
            }
        }
    }
    
});
