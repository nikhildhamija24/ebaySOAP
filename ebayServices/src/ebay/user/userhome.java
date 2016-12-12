package ebay.user;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.jws.WebService;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@WebService
public class userhome {
	
	public String getUserProfile(int userid){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		
		try{
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			PreparedStatement statement = conn.prepareStatement("Select * from ebay.ebaysignup where userid=?");
			
			statement.setInt(1, userid);
			ResultSet rs = statement.executeQuery();
			System.out.println(rs);
			if(rs.next()){
				JSONArray jsarray = new JSONArray();
				int total_rows = rs.getMetaData().getColumnCount();
		        JSONObject obj1 = new JSONObject();
		        for(int i = 0; i < total_rows; i++) {
		            try {
						obj1.put(rs.getMetaData().getColumnLabel(i + 1).toLowerCase(), rs.getObject(i + 1));
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
		        }
		        jsarray.put(obj1);
		        obj = new JSONObject();
				obj.put("statusCode",new Integer(200));
				obj.put("msg","success");
			    obj.put("email", rs.getString(1));
			    obj.put("userProfile", jsarray);
			    str = obj.toString();			    
			}else{
				obj = new JSONObject();
			    obj.put("statusCode",new Integer(401));
			    obj.put("msg","No user data available");
			    str= obj.toString();
			}
			
		} catch(ClassNotFoundException e) {
			e.printStackTrace();
		}

		catch(SQLException e) {
			e.printStackTrace();
		} catch(JSONException e){
			e.printStackTrace();
		}
		return str;
	}
	
	public String updateUserProfile(int userid, String userbday, String ebayhandle, String location, String contact){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			
			PreparedStatement statement = conn.prepareStatement("update ebaysignup set userbday=?, ebayhandle=?, location=?, contact=? where userid=?");
			statement.setString(1, userbday);
			statement.setString(2, ebayhandle);
			statement.setString(3, location);
			statement.setString(4, contact);
			statement.setInt(5, userid);
			
			int rs = statement.executeUpdate();
			if(rs == 1){
//				JSONArray jsonArray = new JSONArray();
				obj = new JSONObject();
			    obj.put("statusCode",new Integer(200));
			    obj.put("msg","success");				  
			    str= obj.toString();
			}else{
				obj = new JSONObject();
			    obj.put("statusCode",new Integer(401));
			    obj.put("msg","Incorrect Details");
			    str= obj.toString();
			}
		}
		catch(ClassNotFoundException ex){
			ex.printStackTrace();
		}catch(SQLException ex){
			ex.printStackTrace();
		}catch(JSONException ex){
			ex.printStackTrace();
		}		
		return str;
	}

}
