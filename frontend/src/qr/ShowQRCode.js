import { Box, Button } from "@mui/material";
import QRCode from 'react-qr-code';

const ShowQRCode = ({ qrData }) => {
  // const onImageDownload = () => {
  //   const svg = document.getElementById("QRCode");
  //   const svgData = new XMLSerializer().serializeToString(svg);
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");
  //   const img = new Image();
  //   img.onload = () => {
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     ctx.drawImage(img, 0, 0);
  //     const pngFile = canvas.toDataURL("image/png");
  //     const downloadLink = document.createElement("a");
  //     downloadLink.download = "QRCode";
  //     downloadLink.href = `${pngFile}`;
  //     downloadLink.click();
  //   };
  //   img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  // };
  // const onImageDownloadGold = () => {
  //   const svg = document.getElementById("QRCodeGold");
  //   const svgData = new XMLSerializer().serializeToString(svg);
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");
  //   const img = new Image();
  //   img.onload = () => {
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     ctx.drawImage(img, 0, 0);
  //     const pngFile = canvas.toDataURL("image/png");
  //     const downloadLink = document.createElement("a");
  //     downloadLink.download = "QRCodeGold";
  //     downloadLink.href = `${pngFile}`;
  //     downloadLink.click();
  //   };
  //   img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  // };
  return (
    <Box sx={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "1rem",
      padding: "1rem",
      // backgroundColor:"red"
    }}>
      <QRCode id="QRCode" value={qrData} size={256}
        bgColor="transparent"
        fgColor="#000000" />
      {/* <button style={{cursor:"pointer"}} disabled={qrData === "" ? true : false} onClick={() => onImageDownload()}>Download QR</button> */}

      {/* <Box p={2}/>

      <QRCode id="QRCodeGold" value={qrData} size={256}
        bgColor="transparent"
        fgColor="#d4af37" />
      <button style={{cursor:"pointer"}} disabled={qrData === "" ? true : false} onClick={() => onImageDownloadGold()}>Download Gold QR</button> */}
    </Box>
  )
}
export default ShowQRCode;