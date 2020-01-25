package pianoboard.service.Resources;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.PATCH;
import javax.ws.rs.DELETE;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.core.Response;
import javax.servlet.http.HttpServletRequest;

import java.io.IOException;
import com.fasterxml.jackson.core.JsonProcessingException;
import javax.naming.AuthenticationException;

import pianoboard.service.Activities.AccountActivity;
import pianoboard.service.Representations.AccountRepresentation;

import pianoboard.data_access.account.AccountAccessor;

@Path("/users")
public class AccountService extends Service {

	private AccountActivity activity = new AccountActivity();
	private CORSFilter filter = new CORSFilter();

	public AccountService() {}

	@GET
	@Produces("application/json")
	public Response search(@QueryParam("search") String query) {
		try {
			// Attempt to log in to the given account with the provided credentials
			return filter.addCORS(Response.ok(activity.search(query)));
		} catch(IOException e) {
			// The account was not found so we return a not found status
			return filter.addCORS(Response.status(404));
		}
	}

	@GET
	@Path("/{ID}")
	@Produces("application/json")
	public Response get(@PathParam("ID") String ID) {
		System.out.println("GET REQUEST ON USERS PATH TO RETRIEVE DATA FROM USER ID " + ID);
		try {
			// Attempt to log in to the given account with the provided credentials
			return filter.addCORS(Response.ok(activity.get(ID)));
		} catch(JsonProcessingException e) {
			// Something went wrong reading the account and we return a server error code
			return filter.addCORS(Response.status(500));
		} catch(IOException e) {
			// The account was not found so we return a not found status
			System.out.println("Error: " + e.getMessage());
			return filter.addCORS(Response.status(404));
		}
	}

	@GET
	@Path("/{ID}/{attribute}")
	@Produces("application/json")
	public Response get(@PathParam("ID") String ID, @PathParam("attribute") String attribute) {
		if(attribute.contains("password")) return filter.addCORS(Response.status(405));
		try {
			// Attempt to log in to the given account with the provided credentials
			return filter.addCORS(Response.ok(activity.getAttribute(ID, attribute)));
		} catch(JsonProcessingException e) {
			// Something went wrong reading the account and we return a server error code
			return filter.addCORS(Response.status(500));
		} catch(IOException e) {
			// The account was not found so we return a not found status
			return filter.addCORS(Response.status(404));
		}
	}

	@PATCH
	@Path("/{ID}/{attribute}")
	@Produces("application/json")
	public Response update(	@PathParam("ID") String ID,
							@PathParam("attribute") String attribute,
							@QueryParam("action") String action,
							@HeaderParam("authorization") String token,
							String data,
							HttpServletRequest request) {
		// TODO authorize token with username then update attribute with data if authorization passes
		return filter.addCORS(Response.ok());
	}

	@DELETE
	@Produces("application/json")
	public Response delete(@PathParam("username") String username, @HeaderParam("authorization") String token) {
		// TODO authorize token with username then delete account
		return filter.addCORS(Response.ok());
	}
}
