using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Test_Client
{
    /// <summary>
    /// Interaktionslogik für MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        public MainWindow()
        {
            InitializeComponent();
        }

        async private void BtnCreateUsers_Click(object sender, RoutedEventArgs e)
        {
            /*
            for(int i = 0; i < 10; i++)
            {
                PostSingleUser(i);
            }
            */


            User testUser = CreateRandomUser();
            WriteLog($"\n try to create user object at backend '{testUser}'", true);

            HttpResponseMessage response = null;
            HttpClient client = new HttpClient();
            HttpContent httpContent = new StringContent(JsonConvert.SerializeObject(testUser), Encoding.UTF8);

            client.BaseAddress = new Uri(GetBackendURL());
            client.DefaultRequestHeaders.Accept.Clear();
            //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json));
            httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            response = await client.PostAsync(GetUsersEndPoint(), httpContent);
            var responseText = response.StatusCode.ToString() + " " + await response.Content.ReadAsStringAsync();
            WriteLog(responseText, response.StatusCode == System.Net.HttpStatusCode.Created);
        }

        /*
        private async void PostSingleUser(int PostFixValue)
        {
            try
            {
                #region Create -NET TestUser - Object
                User testUser = null;
                if (PostFixValue == -1)
                {
                    testUser = CreateTestUserObject();
                }
                else
                {
                    testUser = CreateTestUserObject(PostFixValue);
                }
                WriteLog($"{ DateTime.Now} > try to create user object at backend '{testUser}'", true);
                #endregion

                #region Send Object to node Backend via HTTP and show result
                HttpResponseMessage response = await SendPostRequest(testUser);
                string responseText = DateTime.Now + " > " + response.StatusCode.ToString() + " " + await response.Content.ReadAsStringAsync();
                WriteLog(responseText, response.StatusCode == System.Net.HttpStatusCode.Created);


                #endregion

            }
            catch (Exception ex)
            {
                WriteLog(ex.Message, false);
            }
        }
        */
        /*private Task<HttpResponseMessage> SendPostRequest(User testUser)
        {
            HttpClient client = new HttpClient
            {
                BaseAddress = new Uri(GetBackendURL())
            };
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            return await client.PostAsJsonAsync(GetUsersEndPoint(), testUser);
        }
        */

        private User CreateRandomUser()
        {
            Random rnd = new Random((int)DateTime.Now.Ticks);
            string rndVal = rnd.Next(1000).ToString();

            return new User
            {
                firstname = ".net fn " + rndVal,
                lastname = ".net ln " + rndVal,
                username = "U_" + rndVal,
                password = "1234",
                state = "offline"
            };
        }

        private string GetBackendURL()
        {
            return tbBackendUrl.Text;
        }

        private string GetUsersEndPoint()
        {
            return tbUsersEndPoint.Text;
        }

        private string GetLogsEndPoint(string logId)
        {
            return "/api/logs/{" + logId + "}?nolog=true";
        }

        private void WriteLog(string message, bool statuscode)
        {
            string content = "\n" + message + "\n";
            if (statuscode)
            {
                content += Success.Text;
                Success.Text = content;
            }
            else
            {
                content += Error.Text;
                Error.Text = content;
            }
        }
    }
}
