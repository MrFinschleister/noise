class Perlin {
    constructor(seed) {
        this.seed = 0

        for (let x = 0; x < String(seed).length; x++) {
            this.seed += String(seed).charCodeAt(x)
        }

        this.perm = [151,160,137,91,90,15,
            131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
            190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
            88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
            77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
            102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
            135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
            5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
            223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
            129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
            251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
            49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
            138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]
        
        this.randLookup = {}
        this.valLookup = {}
    }

    random(seed) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762

        h1 = h2 ^ (h1 ^ seed * 597399067)
        h2 = h3 ^ (h2 ^ seed * 2869860233)
        h3 = h4 ^ (h3 ^ seed * 951274213)
        h4 = h1 ^ (h4 ^ seed * 2716044179)
        
        h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1
        return Math.abs(h1 / (h2 ^ h3) * h4) % 1
    }

    getUnitVector(x, y) {
        let seed = this.seedSum ^ (x ^ this.perm[x % 512]) ^ (y ^ this.perm[y ^ 512])

        if (this.randLookup[seed]) {
            return this.randLookup[seed]
        } else {
            let rand = this.random(seed)

            let x1 = Math.cos(rand * Math.PI * 2)
            let y1 = Math.sin(rand * Math.PI * 2)

            this.randLookup[seed] = [x1, y1]
    
            return [x1, y1]
        }
        
    }

    dotProduct(v1, x2, y2) {
        return v1[0] * x2 + v1[1] * y2
    }

    interpolate(val1, val2, weight) {
        let val = val1 + (val2 - val1) * weight
        return val
    }

    ease(t) {
        let t3 = t * t * t
        let t4 = t3 * t
        let t5 = t4 * t
        return 6 * t5 - 15 * t4 + 10 * t3
    }

    perlin(x, y) {
        let x1 = Math.floor(x)
        let y1 = Math.floor(y)
        let x2 = x1 + 1
        let y2 = y1 + 1

        let x3 = x - x1
        let y3 = y - y1
        let x4 = 1 - x3
        let y4 = 1 - y3

        let dotProd1 = this.dotProduct(this.getUnitVector(x1, y1), x3, y3)
        let dotProd2 = this.dotProduct(this.getUnitVector(x2, y1), -x4, y3)
        let dotProd3 = this.dotProduct(this.getUnitVector(x1, y2), x3, -y4)
        let dotProd4 = this.dotProduct(this.getUnitVector(x2, y2), -x4, -y4)

        let iP1 = this.interpolate(dotProd1, dotProd2, this.ease(x3))
        let iP2 = this.interpolate(dotProd3, dotProd4, this.ease(x3))
        let iP3 = this.interpolate(iP1, iP2, this.ease(y3))

        return iP3
    }

    perlinLayered(x, y) {
        x /= this.cellSize
        y /= this.cellSize

        let val = 0

        let frequency = this.frequency
        let factor = this.factor

        for (let i = 0; i < this.octaves; i++) {
            let x1 = x * frequency + i * 0.72
            let y1 = y * frequency + i * 0.72

            val += this.perlin(x1, y1) * factor

            frequency *= this.roughness
            factor *= this.persistence
        }

        return val * this.contrast
    }
}