const ml = require('machine_learning');

class AutoPilot{
    // constructor to take data and result arrays
    constructor(dataArray, resultArray){
        this.dataArray = dataArray;
        this.resultArray = resultArray;
        this.dt = null;
        this.status = false;
    //calling train function to train model
    if(this.dataArray.length !== 0 && !this.resultArray.length == 0)
    this.train()
    }

    //training the model using dataArray and resultArray
    train(){
        console.log("training...");
            this.dt = new ml.DecisionTree({
            data : this.dataArray,
            result : this.resultArray
        });
        
        this.dt.build();

    }

    // prediction
    predict(day, time){
        console.log("predicting...");

        // if array recieved is empty
        if(this.dataArray.length == 0 || this.resultArray.length == 0)
            return false

        // predicting the result

        const result = this.dt.classify([day, time]);

        console.log("Classify : ", result);
        console.log(this.dt.prune(1.0))
        if(Object.keys(result).length == 2){
            if(result.false >= result.true)
                this.status = false;
            else
                this.status = true;
        }
        else if(String(Object.keys(result)) == 'false' )
            this.status = false;
        else
            this.status = true;

        return this.status;
    }
}

module.exports = AutoPilot