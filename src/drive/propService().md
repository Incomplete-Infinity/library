# `propService()`

## Summary

### Code

```js
const propService = {
  scriptProps: {
    /**
     * @method write()
     * @name propService.scriptProps.write()
     * @description Writes the given object's key/value pairs to script properties
     * @param object {object}
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    write: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const scrptProps = PropertiesService.getScriptProperties();
        Object.keys(object).forEach((key) =>
          scrptProps.setProperty(key, object[key])
        );
        return object;
      } catch (error) {
        console.error(
          `Error in propService.scriptProps.write: ${error.message}`
        );
        return { error: error.message };
      }
    },
    /**
     * @method read()
     * @name propService.scriptProps.read()
     * @description Reads properties with the given keys the given object to script properties and writes them to the object parameter.
     * @param {object} object - An object that contains all the key to be looked up with placeholder values
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    read: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const scrptProps = PropertiesService.getScriptProperties();
        Object.keys(object).forEach(
          (key) => (object[key] = scrptProps.getProperty(key))
        );
        return object;
      } catch (error) {
        console.error(
          `Error in propService.scriptProps.read: ${error.message}`
        );
        return { error: error.message };
      }
    },
  },
  userProps: {
    /**
     * @method write()
     * @name propService.userProps.write()
     * @description Writes the given object's key/value pairs to user properties
     * @param {object} object - the object to be written to the user properties in the form of
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    write: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const usrProps = PropertiesService.getUserProperties();
        Object.keys(object).forEach((key) =>
          usrProps.setProperty(key, object[key])
        );
        return object;
      } catch (error) {
        console.error(`Error in propService.userProps.write: ${error.message}`);
        return { error: error.message };
      }
    },
    /**
     * @method read()
     * @name propService.userProps.read()
     * @description Reads properties with the given keys the given object to user properties and writes them to the object parameter.
     * @param {object} object - An object that contains all the key to be looked up with placeholder values
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    read: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const usrProps = PropertiesService.getUserProperties();
        Object.keys(object).forEach(
          (key) => (object[key] = usrProps.getProperty(key))
        );
        return object;
      } catch (error) {
        console.error(`Error in propService.userProps.read: ${error.message}`);
        return { error: error.message };
      }
    },
  },
  docProps: {
    /**
     * @method write()
     * @name propService.scriptProps.write()
     * @description Writes the given object's key/value pairs to script properties
     * @param object {object}
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    write: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const scrptProps = PropertiesService.getScriptProperties();
        Object.keys(object).forEach((key) =>
          scrptProps.setProperty(key, object[key])
        );
        return object;
      } catch (error) {
        console.error(
          `Error in propService.scriptProps.write: ${error.message}`
        );
        return { error: error.message };
      }
    },
    /**
     * @method read()
     * @name propService.docProps.read()
     * @description Reads properties with the given keys the given object to script properties and writes them to the object parameter.
     * @param {object} object - An object that contains all the key to be looked up with placeholder values
     * @example object = {key, value}
     * @return {object} The object parameter for chaining
     */
    read: (object = {}) => {
      try {
        if (!Object.keys(object).length) {
          throw new Error(`The "object" parameter is empty or undefined`);
        }
        const scrptProps = PropertiesService.getScriptProperties();
        Object.keys(object).forEach(
          (key) => (object[key] = scrptProps.getProperty(key))
        );
        return object;
      } catch (error) {
        console.error(
          `Error in propService.scriptProps.read: ${error.message}`
        );
        return { error: error.message };
      }
    },
  },
};
```
