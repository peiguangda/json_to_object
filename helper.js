module.exports = {
    replace_string: replace_string = function (string, text) {
        if (typeof string === 'string' || string instanceof String) {
            string = string.replace(text, "\n");
            if (string.includes(text)) return replace_string(string, text);
        }
        return string;
    },

    get_answer: get_answer = function (number, string) {
        var array = string.split("\n");
        if (array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].includes(number)) return array[i];
            }
            return "４";
        } else return null;
    }
};