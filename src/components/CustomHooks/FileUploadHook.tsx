import { useState } from "react"

const FileUploadHook = (files: any) => {
    const [state, setState] = useState<any>(null)
    const zipTargetFiles: any = async (files: any) => {
        let zipFile: any = null
        if (files.length === 1) {
            setState({
                zipFile,
                file: files[0]
            })
        } else {
            const zip = require('jszip')();
            let matrixFile: any = null
            for (let i = 0; i < files.length; i++) {
                if (files[i].name === 'matrix.xlsx') {
                    matrixFile = files[i]
                }
                if (files[i].type === 'application/zip' || files[i].type === "application/x-zip-compressed") {
                    zipFile = files[i]
                }
                if (!zipFile && files[i].name !== 'matrix.xlsx') {
                    zip.file(files[i].name, files[i]);
                }
            }
            if (!zipFile) {
                zip.generateAsync({ type: "blob" })
                    .then((content: any) => {
                        return new File([content], 'new.zip', { type: 'application/x-zip-compressed' })
                    })
                    .then((file: any) => {
                        setState({
                            matrixFile,
                            file: file
                        });
                    })
            } else {
                setState({
                    matrixFile,
                    file: zipFile
                });
            }
        }
    }
    return [
        state,
        {
            zipTargetFiles
        }
    ];
}

export default FileUploadHook