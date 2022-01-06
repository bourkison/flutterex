const mongoose = require("mongoose");
const mongooseConnect = require("./mongoose-connection");

const teamNames = ["ATL", "BKN", "BOS", "CHA", "CHI", "CLE", "DAL", "DEN", "DET", "GS", "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NO", "NY", "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SA", "TOR", "UTA", "WAS"];

const contractSchema = new mongoose.Schema({
    game: {
        id: {
            type: String,
            required: true
        },
        shortName: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        homeTeam: {
            type: String,
            required: true,
            enum: teamNames
        },
        awayTeam: {
            type: String,
            required: true,
            enum: teamNames
        }
    },
    init: {
        team: {
            type: String,
            required: true,
            validate: {
                validator: (t) => {
                    return t === this.game.homeTeam || t === this.game.awayTeam;
                }
            }
        },
        amount: {
            type: Number,
            required: true,
            min: 5
        },
        rate: {
            type: Number,
            required: true,
            min: 1.01
        },
        createdBy: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    fulfill: {
        team: {
            type: String,
            required: true,
            enum: [this.game.homeTeam, this.game.awayTeam],
            default: () => {
                if (this.init.team === this.homeTeam) {
                    return this.awayTeam;
                } else if (this.init.team === this.awayTeam) {
                    return this.homeTeam;
                }
            }
        },
        amount: {
            type: Number,
            default: () => {
                return this.init.amount * (this.init.rate - 1);
            }
        },
        rate: {
            type: Number,
            default: () => {
                const fulfillAmount = this.init.amount * (this.init.rate - 1);
                const totalValue = this.init.amount * this.init.rate;
                
                return totalValue / fulfillAmount;
            }
        },
        fulfilledBy: {
            type: String,
            default: ""
        },
        fulfilledAt: {
            type: Date,
            default: Date.now
        }
    },
    isFulfilled: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    complete: {
        team: {
            type: String,
            required: false,
            enum: [this.game.homeTeam, this.game.awayTeam]
        },
        winner: {
            type: String,
            required: false,
            enum: [this.init.createdBy, this.fulfill.fulfilledBy]
        },
        loser: {
            type: String,
            required: false,
            enum: [this.init.createdBy, this.fulfill.fulfilledBy]
        }
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    wallet: {
        availableAmount: {
            type: Number,
            default: 0,
            min: 0
        },
        pendingAmount: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    contracts: {
        type: [mongoose.Types.ObjectId],
        default: []
    }
});

module.exports = () => {
    const User = async (uri) => {
        const connection = await mongooseConnect(uri);
        const response =  await connection.model("User", userSchema);   
        return response;
    }

    const Contract = async (uri) => {
        const connection = await mongooseConnect(uri);
        const response =  await connection.model("Contract", contractSchema);   
        return response;
    }

    return { User, Contract }
}