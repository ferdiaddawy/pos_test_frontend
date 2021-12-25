export const ParseError = (error) => {
    if (error.response.status == 402 || error.response.status == 401 || error.response.status == 406) {
      return error.response.data.message
    }
    else if (error.response.status == 500) {
      return 'Telah terjadi kesalahan pada saat proses data, silahkan kontak team IT';
    }
    else {
      return error.message
    }
  }