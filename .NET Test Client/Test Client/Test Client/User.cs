using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Test_Client
{
    class User
    {

        public string id { get; set; }

        public string firstname { get; set; }

        public string lastname { get; set; }

        public string username { get; set; }

        public string password { get; set; }

        public string state { get; set; }

        public override string ToString()
        {
            return string.Format($"{firstname} {lastname} {username}");
        }

      
    }
}
