using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Viewmodels
{
    public class LicenseRequest
    {
        public string ChipSetId { get; set; } = "";
        public DateTime StartTime { get; set; }       
        public DateTime ExpiredTime { get; set; }
    }
}
