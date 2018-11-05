const utils = require('../../utils')
const Issue = utils.issues.Issue

const participantsInSubjects = (participants, subjects) => {
  const issues = []
  if (participants) {
    const participantsFromFile = participants.list.sort()
    const participantsFromFolders = subjects.sort()
    if (
      !utils.array.equals(participantsFromFolders, participantsFromFile, true)
    ) {
      const evidence = constructMismatchEvidence(
        participantsFromFolders,
        participantsFromFile,
      )
      issues.push(
        new Issue({
          code: 49,
          evidence: evidence,
          file: participants.file,
        }),
      )
    }
  }
  return issues
}

const constructMismatchEvidence = (participants, subjects) => {
  const diffs = utils.array.diff(participants, subjects)
  const subjectsNotInParticipantsArray = diffs[0]
  const subjectsNotInSubjectsArray = diffs[1]
  const evidenceOfMissingParticipants = subjectsNotInParticipantsArray.length
    ? 'Subjects ' +
      subjectsNotInParticipantsArray.join(', ') +
      ' were found in the folder structure but are missing in participants.tsv. '
    : ''
  const evidenceOfMissingSubjects = subjectsNotInSubjectsArray.length
    ? 'Subjects ' +
      subjectsNotInSubjectsArray.join(', ') +
      ' were found in participants.tsv but are not present in the folder structure. '
    : ''
  const evidence = evidenceOfMissingParticipants + evidenceOfMissingSubjects
  return evidence
}

const atLeastOneSubject = fileList => {
  const issues = []
  const fileKeys = Object.keys(fileList)
  const hasSubjectDir = fileKeys.some(key => {
    const file = fileList[key]
    return file.relativePath && file.relativePath.startsWith('/sub-')
  })
  if (!hasSubjectDir) {
    issues.push(new Issue({ code: 45 }))
  }
  return issues
}

module.exports = {
  participantsInSubjects,
  atLeastOneSubject,
}
