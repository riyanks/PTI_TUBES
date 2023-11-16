export function ExportToTxt(data: any, filename: string) {
  if (data) {
    const txtData = data.map((row: any, rowIndex: any) => {
      const rowData = Object.values(row).join('\t')
      return `${rowIndex + 1}\t${rowData}`
    }).join('\n')

    const blob = new Blob([txtData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'

    document.body.appendChild(a)

    a.click()

    URL.revokeObjectURL(url)

    document.body.removeChild(a)
  }
}
