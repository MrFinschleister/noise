class Perlin {
    constructor(seed) {
        this.seed = String(seed)
    }

    random(seed) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762

        for (let i = 0, k; i < seed.length; i++) {
            k = seed.charCodeAt(i)
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
        }
        h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1
        return Math.abs(h1 / (h2 ^ h3) * h4) % 1
    }

    getUnitVector(x, y) {
        let rand = this.random(this.seed + String(x) + String(y))

        let x1 = Math.cos(rand * Math.PI * 2)
        let y1 = Math.sin(rand * Math.PI * 2)

        return [x1, y1]
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

    perlinLayered(x, y, octaves, cellSize, frequency, factor, roughness, persistence, contrast) {
        x /= cellSize
        y /= cellSize

        let val = 0

        for (let i = 0; i < octaves; i++) {
            let x1 = x * frequency + i * 0.72
            let y1 = y * frequency + i * 0.72

            val += this.perlin(x1, y1) * factor

            frequency *= roughness
            factor *= persistence
        }

        return val * contrast
    }
}