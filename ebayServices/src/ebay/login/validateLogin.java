package ebay.login;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.jws.WebService;


@WebService
public class validateLogin {
//	private ResultSet resultSet = null;
//	private static Connection conn = null;
//	private Statement statement = null;
////	private PreparedStatement preparedStatement = null;
	
	

	public String validate(String username){
		System.out.println("inside validate");
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		try {
			Class.forName("com.mysql.jdbc.Driver");
//			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			PreparedStatement statement = conn.prepareStatement("Select * from ebay.ebaysignup where email=?");
			
			statement.setString(1, username);
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
			    obj.put("msg","Incorrect Username or password");
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
	
	public String register(String username, String fname, String lname, String password){
		String dbPath = "jdbc:mysql://localhost:3306/ebay";
		JSONObject obj = null;
		String str = "";
		try {
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("inside class.forname");
			Connection conn = DriverManager.getConnection(dbPath, "root", "qwerty123");
			System.out.println("connected to db");
			
			PreparedStatement statement1 = conn.prepareStatement("Select * from ebay.ebaysignup where email=?");			
			statement1.setString(1, username);
			ResultSet rs1 = statement1.executeQuery();
			
			if(rs1.next()){
				obj = new JSONObject();
			    obj.put("statusCode",new Integer(402));
			    obj.put("msg","Username already exists, try with another one");
			    str= obj.toString();
			}else{
			
				PreparedStatement statement = conn.prepareStatement("insert into ebaysignup(firstname, lastname, email, password) values (?, ?, ?, ?)");
				statement.setString(1, fname);
				statement.setString(2, lname);
				statement.setString(3, username);
				statement.setString(4, password);
				
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
