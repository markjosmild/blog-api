const { glob } = require('glob')

module.exports = async () => {
  const jobPathList = await glob('./src/jobs/!(*.spec).js', {
    cwd: process.cwd(),
    absolute: true
  })

  jobPathList.forEach(path => {
    try {
      const job = require(path)
      job.start()
    } catch (error) {
      console.log(error)
      throw new Error(`Error on file ${path}`)
    }
  })
}
