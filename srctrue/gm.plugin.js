/**
 * @name gmPlugin
 * @version 0.0.1 
 * @description send "GM" to selected channels upon opening discord
 * @author undefined
 */

    
   
module.exports = (Plugin, Library) => {

    const {Logger, Patcher} = Library;

    return class ExamplePlugin extends Plugin {

        onStart() {
            Logger.log("Started");
            Patcher.before(Logger, "log", (t, a) => {
                a[0] = "Patched Message: " + a[0];
            });
        }

        onStop() {
            Logger.log("Stopped");
            Patcher.unpatchAll();
        }
    };
};