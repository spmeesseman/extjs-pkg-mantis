/**
 * @class Ext.ux.mantis.store.Severities
 * 
 */
Ext.define('Ext.ux.mantis.store.Severities', 
{
    extend: 'Ext.data.SimpleStore',

    alias: 'mantis.store.severities',
    
    fields: 
    [
        { name: 'id',    type: 'number' },
        { name: 'name',  type: 'string' },
        { name: 'label', type: 'string' }        
    ],
    
    data : [
        ['always'], 
        ['have not tried'], 
        [100, 'n/a'], 
        ['random'], 
        ['sometimes'], 
        ['unabled to reproduce']
    ],
    
    proxy: 
    {
        type: 'memory'
    }
    
});
