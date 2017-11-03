const _ = require('lodash');
const DecisionTree = require('decision-tree');

module.exports = {
    /**
     * Takes the Rightmost 3 Elements from the
     * Mongoose document array as the most recently used pieces of form data
     * @param data
     * @returns {Array}
     */
    perSubjectRecent(data) {
        return _.takeRight(data, 3);
    },

    /**
     * Find the most frequently used
     * @param data
     */
    perSubjectFrequency(data) {
        var frequency = {}, value;

        // compute frequencies of each value
        for(var i = 0; i < data.length; i++) {
            value = data[i].value;
            if(value in frequency) {
                frequency[value]++;
            } else {
                frequency[value] = 1;
            }
        }

        // make array from the frequency object to de-duplicate
        var uniques = [];
        for(value in frequency) {
            uniques.push(value);
        }

        // sort the uniques array in descending order by frequency
        function compareFrequency(a, b) {
            return frequency[b] - frequency[a];
        }
        return uniques.sort(compareFrequency);
    },

    decisionTree(data) {
        let dt = new DecisionTree(data, "value", ["value", "namespace"]);

        let predicted_class = dt.predict({
            value: "Ham",
            namespace: "Pizza.createForm.Meats"
        });

        let treeModel = dt.toJSON();
        return predicted_class;

    },

    bayesian(data) {
        //TODO mutate data
        return data;
    },

    /**
     * Takes a Parent Form Namespace and an array of elements which belong to the form
     * and returns an array of fully quantified Namespaces ready for querying
     * @param formNamespace
     * @param elementArray
     */
    toFullNamespace(formNamespace, elementArray) {
        return elementArray.map(value => {
            return `${formNamespace}.${value}`
        });
    }
};